"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import type { ElevationProfile } from "@/types/train";
import type { ApiResponse } from "@/types/api";

interface ElevationChartProps {
  trainNumber: string;
  currentPositionKm?: number;
  className?: string;
}

export function ElevationChart({
  trainNumber,
  currentPositionKm,
  className,
}: ElevationChartProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["elevation", trainNumber],
    queryFn: async (): Promise<ElevationProfile | null> => {
      const res = await fetch(
        `/api/elevation/profile?trainNumber=${trainNumber}&sampleCount=100`
      );
      const json: ApiResponse<ElevationProfile> = await res.json();
      return json.data ?? null;
    },
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) return <SkeletonCard className={cn("h-48", className)} />;
  if (isError || !data) return null;

  const chartData = data.points.map((p) => ({
    km: Math.round(p.distanceKm),
    elevation: p.elevationM,
  }));

  return (
    <div
      className={cn(
        "bg-white rounded-md border border-[#E5E7EB] shadow-card p-5",
        className
      )}
      role="region"
      aria-label="Route elevation profile"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
            Elevation Profile
          </p>
          <p className="text-sm font-semibold text-[#111318] mt-0.5">
            Highest:{" "}
            <span className="text-[#2563EB]">{data.maxElevationM} m</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#9CA3AF]">
            ↑ {data.totalAscentM} m gain
          </p>
          <p className="text-xs text-[#9CA3AF]">
            ↓ {data.totalDescentM} m loss
          </p>
        </div>
      </div>

      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="km"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "km", position: "insideRight", offset: -4, fontSize: 10, fill: "#9CA3AF" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value: number) => [`${value} m`, "Elevation"]}
              labelFormatter={(label) => `${label} km`}
            />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#2563EB"
              strokeWidth={2}
              fill="url(#elevGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#2563EB" }}
            />
            {currentPositionKm !== undefined && (
              <ReferenceLine
                x={Math.round(currentPositionKm)}
                stroke="#2563EB"
                strokeWidth={2}
                strokeDasharray="4 2"
                label={{ value: "Now", fontSize: 10, fill: "#2563EB", position: "top" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Screen reader description */}
      <p className="sr-only">
        Elevation profile from {data.minElevationM} metres to {data.maxElevationM} metres
        across the journey route. Total ascent {data.totalAscentM} metres,
        total descent {data.totalDescentM} metres.
      </p>
    </div>
  );
}
