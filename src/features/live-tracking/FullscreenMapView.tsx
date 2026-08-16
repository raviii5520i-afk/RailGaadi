"use client";

import dynamic from "next/dynamic";
import { useTrainStatus, useTrainRoute } from "@/hooks/useTrainStatus";
import { TrainStatusCard } from "@/components/train/TrainStatusCard";
import { StationTimeline } from "@/components/train/StationTimeline";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useState } from "react";
import { ChevronUp, ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";

const JourneyMap = dynamic(
  () => import("@/components/map/JourneyMap").then((m) => m.JourneyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#F1F3F5] animate-pulse flex items-center justify-center">
        <p className="text-[#9CA3AF] text-sm">Loading MapTiler map…</p>
      </div>
    ),
  }
);

interface FullscreenMapViewProps {
  trainNumber: string;
}

export function FullscreenMapView({ trainNumber }: FullscreenMapViewProps) {
  const { data: liveData, isLoading } = useTrainStatus(trainNumber);
  const { data: routeData } = useTrainRoute(trainNumber);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  if (isLoading || !liveData) {
    return (
      <div className="w-full h-[calc(100vh-112px)] bg-[#F1F3F5] animate-pulse flex items-center justify-center">
        <p className="text-[#9CA3AF] text-sm">Loading journey map…</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-112px)] overflow-hidden">
      {/* Fullscreen Map Canvas */}
      <JourneyMap
        trainLocation={liveData.location}
        route={routeData}
        currentStationIdx={
          routeData?.stations.findIndex((s) => s.status === "current") ?? -1
        }
      />

      {/* Floating Bottom Drawer / Sheet */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-modal transition-all duration-300 rounded-t-xl max-w-2xl mx-auto",
          sheetExpanded ? "max-h-[80vh] overflow-y-auto" : "max-h-36 overflow-hidden"
        )}
      >
        {/* Drag handle button */}
        <button
          type="button"
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="w-full py-2.5 flex flex-col items-center justify-center text-[#9CA3AF] hover:text-[#111318]"
          aria-label={sheetExpanded ? "Collapse panel" : "Expand panel"}
        >
          <div className="w-10 h-1 bg-[#E5E7EB] rounded-pill mb-1" />
          {sheetExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        <div className="px-4 pb-6 space-y-4">
          <TrainStatusCard data={liveData} />

          {sheetExpanded && routeData && (
            <div className="pt-2">
              <StationTimeline
                stations={routeData.stations}
                currentStationCode={liveData.status.currentStation?.code}
                trainSpeed={liveData.location?.speed}
                trainState={liveData.status.state}
                delayMinutes={liveData.status.delayMinutes}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
