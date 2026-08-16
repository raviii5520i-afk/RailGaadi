"use client";

import { useQuery } from "@tanstack/react-query";
import { Cloud, Wind, Droplets, Thermometer, MapPin } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import type { Weather } from "@/types/train";
import type { ApiResponse } from "@/types/api";

interface WeatherSectionProps {
  currentLat?: number;
  currentLon?: number;
  locationName?: string;
  className?: string;
}

export function WeatherSection({
  currentLat,
  currentLon,
  locationName,
  className,
}: WeatherSectionProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["weather", currentLat, currentLon],
    queryFn: async () => {
      if (!currentLat || !currentLon) return null;
      const res = await fetch(
        `/api/weather?lat=${currentLat}&lon=${currentLon}`
      );
      const json: ApiResponse<Weather> = await res.json();
      return json.data ?? null;
    },
    enabled: !!currentLat && !!currentLon,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });

  if (!currentLat || !currentLon) return null;
  if (isError) return null; // Degrade silently

  if (isLoading) {
    return <SkeletonCard className={cn("h-32", className)} />;
  }

  if (!data) return null;

  return (
    <div
      className={cn(
        "bg-white rounded-md border border-[#E5E7EB] shadow-card p-5",
        className
      )}
      role="region"
      aria-label="Current weather"
    >
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
        <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
          Weather
        </p>
        {locationName && (
          <>
            <span className="text-[#D1D5DB]">·</span>
            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {locationName}
            </div>
          </>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        {/* Temperature */}
        <div>
          <p
            className="text-4xl font-bold text-[#111318] tabular-nums"
            aria-label={`${data.temperature} degrees Celsius`}
          >
            {data.temperature}°
          </p>
          <p className="text-sm text-[#6B7280] mt-1 capitalize">
            {data.condition}
          </p>
          {data.feelsLike && (
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Feels like {data.feelsLike}°
            </p>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <WeatherMetric
            icon={Droplets}
            label="Humidity"
            value={`${data.humidity}%`}
          />
          <WeatherMetric
            icon={Wind}
            label="Wind"
            value={`${data.windSpeed} km/h`}
          />
          {data.rainProbability !== undefined && (
            <WeatherMetric
              icon={Cloud}
              label="Rain"
              value={`${data.rainProbability}%`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function WeatherMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[#9CA3AF] mb-0.5">
        <Icon className="w-3 h-3" aria-hidden="true" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[#111318]">{value}</p>
    </div>
  );
}
