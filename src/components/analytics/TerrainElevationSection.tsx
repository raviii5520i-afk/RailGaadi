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
import { Mountain, ArrowUpRight, ArrowDownRight, Layers, Compass, ShieldCheck } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import type { ElevationProfile } from "@/types/train";
import type { ApiResponse } from "@/types/api";

interface TerrainElevationSectionProps {
  trainNumber: string;
  currentPositionKm?: number;
  className?: string;
}

const TERRAIN_CATEGORY_CONFIG: Record<
  NonNullable<ElevationProfile["terrainCategory"]>,
  { label: string; bg: string; text: string; description: string }
> = {
  COASTAL_PLAIN: {
    label: "Coastal Plain",
    bg: "bg-cyan-50 border-cyan-200",
    text: "text-cyan-800",
    description: "Flat low-lying coastal terrain near sea level.",
  },
  DECCAN_PLATEAU: {
    label: "Deccan Plateau",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    description: "Elevated volcanic plateau with undulating topography.",
  },
  VINDHYA_RANGE: {
    label: "Vindhya Pass Range",
    bg: "bg-[#EFF6FF] border-blue-200",
    text: "text-[#2563EB]",
    description: "Rugged hill region separating Northern & Southern India.",
  },
  GHATS_PASS: {
    label: "Mountain Ghats Pass",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
    description: "Steep gradient mountain passes with railway tunnels & bridges.",
  },
  GANGETIC_PLAIN: {
    label: "Gangetic Plain",
    bg: "bg-green-50 border-green-200",
    text: "text-green-800",
    description: "Alluvial river plain terrain with gentle gradient.",
  },
  HILL_RAILWAY: {
    label: "Hill Railway Route",
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-800",
    description: "High altitude mountain railway corridor.",
  },
};

export function TerrainElevationSection({
  trainNumber,
  currentPositionKm,
  className,
}: TerrainElevationSectionProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["elevation-opentopography", trainNumber],
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

  if (isLoading) return <SkeletonCard className={cn("h-72", className)} />;
  if (isError || !data) return null;

  const chartData = data.points.map((p) => ({
    km: Math.round(p.distanceKm),
    elevation: p.elevationM,
  }));

  const category = data.terrainCategory ?? "VINDHYA_RANGE";
  const catConfig = TERRAIN_CATEGORY_CONFIG[category];

  return (
    <div
      className={cn(
        "bg-white rounded-md border border-[#E5E7EB] shadow-card p-5 space-y-5",
        className
      )}
      role="region"
      aria-label="OpenTopography Terrain & Elevation Profile"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
            <h2 className="text-base font-bold text-[#111318]">
              Terrain & Elevation Intelligence
            </h2>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1">
            Powered by <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span className="font-medium text-[#6B7280]">
              {data.datasetSource ?? "OpenTopography 30m DEM"}
            </span>
          </p>
        </div>

        {/* Terrain Badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-pill border text-xs font-semibold self-start sm:self-auto",
            catConfig.bg,
            catConfig.text
          )}
        >
          <Compass className="w-3.5 h-3.5" aria-hidden="true" />
          {catConfig.label}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ElevationMetric
          label="Highest Peak"
          value={`${data.maxElevationM} m`}
          sub={data.highestPointLocation ?? "Highest point on route"}
          icon={Mountain}
          accent="text-[#2563EB]"
        />
        <ElevationMetric
          label="Lowest Elevation"
          value={`${data.minElevationM} m`}
          sub="Near coastal terminus"
          icon={Layers}
        />
        <ElevationMetric
          label="Total Ascent"
          value={`+${data.totalAscentM} m`}
          sub="Cumulative climb"
          icon={ArrowUpRight}
          accent="text-emerald-600"
        />
        <ElevationMetric
          label="Total Descent"
          value={`-${data.totalDescentM} m`}
          sub="Cumulative descent"
          icon={ArrowDownRight}
          accent="text-amber-600"
        />
      </div>

      {/* Recharts Elevation Profile */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
          <span className="font-medium">Route Elevation Profile (metres)</span>
          <span className="text-[#9CA3AF]">X: Route Distance (km)</span>
        </div>

        <div aria-hidden="true" className="w-full">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="topoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="km"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 10", "dataMax + 20"]}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value: number) => [`${value} metres`, "Altitude"]}
                labelFormatter={(label) => `Distance: ${label} km`}
              />
              <Area
                type="monotone"
                dataKey="elevation"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#topoGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#2563EB", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
              {currentPositionKm !== undefined && (
                <ReferenceLine
                  x={Math.round(currentPositionKm)}
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  label={{
                    value: "Train Position",
                    fontSize: 10,
                    fill: "#2563EB",
                    position: "top",
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Terrain Context Note */}
      <div className="bg-[#F8F9FB] rounded-sm p-3 border border-[#E5E7EB] text-xs text-[#6B7280] flex items-start gap-2">
        <Compass className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-semibold text-[#111318]">Terrain Summary: </span>
          {catConfig.description} The maximum altitude reached along this railway corridor is{" "}
          <strong className="text-[#111318]">{data.maxElevationM} metres</strong> above sea level.
        </div>
      </div>
    </div>
  );
}

function ElevationMetric({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="bg-[#F8F9FB] rounded-sm border border-[#E5E7EB] p-3">
      <div className="flex items-center gap-1 text-[#9CA3AF] mb-1">
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn("text-lg font-bold tabular-nums", accent ?? "text-[#111318]")}>
        {value}
      </p>
      <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">{sub}</p>
    </div>
  );
}
