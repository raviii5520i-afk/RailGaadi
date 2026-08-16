"use client";

import { useQuery } from "@tanstack/react-query";
import { Waves, Mountain, Landmark, Zap, Building2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { GeographicFeature, GeographicFeatureType } from "@/types/train";
import type { ApiResponse } from "@/types/api";

const FEATURE_ICONS: Record<GeographicFeatureType, React.ElementType> = {
  RIVER: Waves,
  LAKE: Waves,
  MOUNTAIN: Mountain,
  GHAT: Mountain,
  BRIDGE: Zap,
  TUNNEL: Zap,
  MONUMENT: Landmark,
  ATTRACTION: Landmark,
  CITY: Building2,
  DISTRICT: Building2,
  FOREST: Mountain,
};

const FEATURE_COLORS: Record<GeographicFeatureType, string> = {
  RIVER: "text-blue-500 bg-blue-50",
  LAKE: "text-blue-500 bg-blue-50",
  MOUNTAIN: "text-stone-500 bg-stone-50",
  GHAT: "text-stone-500 bg-stone-50",
  BRIDGE: "text-orange-500 bg-orange-50",
  TUNNEL: "text-orange-500 bg-orange-50",
  MONUMENT: "text-purple-500 bg-purple-50",
  ATTRACTION: "text-purple-500 bg-purple-50",
  CITY: "text-gray-500 bg-gray-50",
  DISTRICT: "text-gray-500 bg-gray-50",
  FOREST: "text-green-500 bg-green-50",
};

interface NearbyFeaturesProps {
  lat?: number;
  lon?: number;
  className?: string;
}

export function NearbyFeatures({ lat, lon, className }: NearbyFeaturesProps) {
  const { data: features, isLoading } = useQuery({
    queryKey: ["nearby-features", lat, lon],
    queryFn: async () => {
      if (!lat || !lon) return [];
      const res = await fetch(`/api/geography/nearby?lat=${lat}&lon=${lon}&radius=15`);
      const json: ApiResponse<GeographicFeature[]> = await res.json();
      return json.data ?? [];
    },
    enabled: !!lat && !!lon,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });

  if (isLoading || !features?.length) return null;

  return (
    <div className={cn("bg-white rounded-md border border-[#E5E7EB] shadow-card", className)}>
      <div className="px-5 py-4 border-b border-[#F3F4F6]">
        <h2 className="text-sm font-semibold text-[#111318]">Nearby</h2>
        <p className="text-xs text-[#9CA3AF] mt-0.5">
          Points of interest along your route
        </p>
      </div>

      <ul className="divide-y divide-[#F9FAFB]">
        {features.slice(0, 5).map((feature) => (
          <NearbyFeatureCard key={feature.id} feature={feature} />
        ))}
      </ul>
    </div>
  );
}

function NearbyFeatureCard({ feature }: { feature: GeographicFeature }) {
  const Icon = FEATURE_ICONS[feature.type] ?? Landmark;
  const colorClass = FEATURE_COLORS[feature.type] ?? "text-gray-500 bg-gray-50";

  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <div className={cn("w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0", colorClass)}>
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#111318] truncate">{feature.name}</p>
        <p className="text-xs text-[#9CA3AF] capitalize mt-0.5">
          {feature.type.toLowerCase().replace("_", " ")}
        </p>
      </div>
      <span className="text-xs text-[#9CA3AF] flex-shrink-0">
        {feature.distanceFromTrainKm < 1
          ? `${Math.round(feature.distanceFromTrainKm * 1000)} m`
          : `${feature.distanceFromTrainKm.toFixed(1)} km`}
      </span>
    </li>
  );
}
