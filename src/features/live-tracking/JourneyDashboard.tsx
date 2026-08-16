"use client";

import dynamic from "next/dynamic";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTrainStatus, useTrainRoute } from "@/hooks/useTrainStatus";
import { TrainStatusCard } from "@/components/train/TrainStatusCard";
import { JourneyProgress } from "@/components/train/JourneyProgress";
import { StationTimeline } from "@/components/train/StationTimeline";
import { TerrainElevationSection } from "@/components/analytics/TerrainElevationSection";
import { SkeletonCard } from "@/components/ui/Skeleton";

// Lazy-load the map (heavy MapLibre GL)
const JourneyMap = dynamic(
  () => import("@/components/map/JourneyMap").then((m) => m.JourneyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] md:h-full bg-[#F1F3F5] rounded-md animate-pulse flex items-center justify-center">
        <p className="text-[#9CA3AF] text-sm">Loading map…</p>
      </div>
    ),
  }
);

interface JourneyDashboardProps {
  trainNumber: string;
}

export function JourneyDashboard({ trainNumber }: JourneyDashboardProps) {
  const {
    data: liveData,
    isLoading,
    isError,
    error,
    refetch,
  } = useTrainStatus(trainNumber);

  const { data: routeData } = useTrainRoute(trainNumber);

  if (isLoading) {
    return <JourneyDashboardSkeleton trainNumber={trainNumber} />;
  }

  if (isError) {
    return <JourneyErrorState error={error} trainNumber={trainNumber} onRetry={refetch} />;
  }

  if (!liveData) return null;

  return (
    <div className="animate-[fade-in_0.3s_ease-out]">
      {/* Desktop Layout: Map left, status right */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="grid md:grid-cols-[1fr_380px] gap-4">
          {/* Left: Map (desktop) */}
          <div className="order-2 md:order-1">
            <div className="md:h-[calc(100vh-200px)] md:sticky md:top-[72px]">
              <div className="w-full h-[300px] md:h-full rounded-md overflow-hidden border border-[#E5E7EB] shadow-card">
                <JourneyMap
                  trainLocation={liveData.location}
                  route={routeData}
                  currentStationIdx={
                    routeData?.stations.findIndex(
                      (s) => s.status === "current"
                    ) ?? -1
                  }
                />
              </div>
            </div>
          </div>

          {/* Right: Status panel */}
          <div className="order-1 md:order-2 space-y-4">
            {/* Status Card */}
            <TrainStatusCard data={liveData} />

            {/* Journey Progress */}
            <JourneyProgress progress={liveData.progress} />

            {/* Station Timeline with Live Train Indicator */}
            {routeData && (
              <StationTimeline
                stations={routeData.stations}
                currentStationCode={liveData.status.currentStation?.code}
                trainSpeed={liveData.location?.speed}
                trainState={liveData.status.state}
                delayMinutes={liveData.status.delayMinutes}
              />
            )}
          </div>
        </div>

        {/* Terrain & Elevation Section (OpenTopography) */}
        <div className="mt-4">
          <TerrainElevationSection
            trainNumber={trainNumber}
            currentPositionKm={liveData.progress.distanceCoveredKm}
          />
        </div>
      </div>
    </div>
  );
}

function JourneyDashboardSkeleton({ trainNumber }: { trainNumber: string }) {
  return (
    <div>
      {/* Skeleton Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F3F4F6] rounded-md skeleton flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-24 skeleton rounded-sm" />
            <div className="h-5 w-48 skeleton rounded-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="grid md:grid-cols-[1fr_380px] gap-4">
          <div className="order-2 md:order-1">
            <div className="w-full h-[300px] md:h-[500px] bg-[#F1F3F5] rounded-md skeleton" />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <SkeletonCard className="h-48" />
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyErrorState({
  error,
  trainNumber,
  onRetry,
}: {
  error: unknown;
  trainNumber: string;
  onRetry: () => void;
}) {
  const isNotFound =
    error && typeof error === "object" && "code" in error
      ? (error as { code: string }).code === "TRAIN_NOT_FOUND"
      : false;

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle
          className="w-6 h-6 text-amber-500"
          aria-hidden="true"
        />
      </div>

      <h2 className="text-lg font-semibold text-[#111318] mb-2">
        {isNotFound ? "Train not found" : "Live status unavailable"}
      </h2>
      <p className="text-sm text-[#6B7280] mb-6">
        {isNotFound
          ? `We couldn't find train ${trainNumber}. Please check the train number and try again.`
          : "RailGaadi couldn't retrieve the latest train data. Please try again."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {!isNotFound && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-sm hover:bg-[#1d4ed8] transition-colors duration-micro"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#6B7280] text-sm font-medium rounded-sm border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors duration-micro"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>
      </div>
    </div>
  );
}
