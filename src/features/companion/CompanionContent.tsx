"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { WeatherSection } from "@/components/weather/WeatherSection";
import { NearbyFeatures } from "@/components/geography/NearbyFeatures";
import { useTrainStatus } from "@/hooks/useTrainStatus";

interface CompanionContentProps {
  trainNumber: string;
}

export function CompanionContent({ trainNumber }: CompanionContentProps) {
  const { data: liveData } = useTrainStatus(trainNumber);

  const lat = liveData?.location?.latitude;
  const lon = liveData?.location?.longitude;
  const stationName = liveData?.status.currentStation?.name;

  return (
    <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
      <Link
        href={`/journey/${trainNumber}`}
        className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111318] transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Journey
      </Link>

      <h1 className="text-2xl font-bold text-[#111318]">Travel Companion</h1>
      <p className="text-sm text-[#9CA3AF]">
        Weather, geography, and points of interest along your route
      </p>

      <WeatherSection
        currentLat={lat}
        currentLon={lon}
        locationName={stationName}
      />

      <NearbyFeatures lat={lat} lon={lon} />

      {!lat && !lon && (
        <div className="text-center py-8">
          <p className="text-[#9CA3AF] text-sm">
            Train location unavailable — companion data will appear once the
            train position is known.
          </p>
        </div>
      )}
    </div>
  );
}
