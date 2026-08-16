"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Minus, MapPin, Clock, Route } from "lucide-react";
import { TerrainElevationSection } from "@/components/analytics/TerrainElevationSection";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useTrainStatus, useTrainRoute } from "@/hooks/useTrainStatus";
import { cn, formatNumber } from "@/utils/cn";
import type { TrainAnalytics } from "@/types/train";
import type { ApiResponse } from "@/types/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AnalyticsDashboardProps {
  trainNumber: string;
}

export function AnalyticsDashboard({ trainNumber }: AnalyticsDashboardProps) {
  const { data: liveData } = useTrainStatus(trainNumber);
  const { data: routeData } = useTrainRoute(trainNumber);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics", trainNumber],
    queryFn: async (): Promise<TrainAnalytics | null> => {
      const res = await fetch(`/api/trains/${trainNumber}/analytics`);
      const json: ApiResponse<TrainAnalytics> = await res.json();
      return json.data ?? null;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const currentLat = liveData?.location?.latitude;
  const currentLon = liveData?.location?.longitude;

  return (
    <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
      {/* Back link */}
      <Link
        href={`/journey/${trainNumber}`}
        className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111318] transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Journey
      </Link>

      <h1 className="text-2xl font-bold text-[#111318]">Journey Analytics</h1>
      <p className="text-sm text-[#9CA3AF]">
        Train {trainNumber} · {liveData?.train.name}
      </p>

      {/* Metric Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} className="h-24" />)}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Completed"
            value={`${analytics.progress.percentage}%`}
            sub={`${formatNumber(analytics.progress.distanceCoveredKm)} km`}
            icon={Route}
          />
          <MetricCard
            label="Remaining"
            value={`${formatNumber(analytics.progress.distanceRemainingKm)} km`}
            sub={`of ${formatNumber(analytics.progress.totalDistanceKm)} km`}
            icon={MapPin}
          />
          <MetricCard
            label="Delay"
            value={
              analytics.delayHistory.length > 0
                ? formatDelay(analytics.delayHistory[analytics.delayHistory.length - 1].delayMinutes)
                : "On Time"
            }
            sub={getDelayTrend(analytics)}
            icon={Clock}
            highlight={analytics.delayHistory.at(-1)?.delayMinutes !== 0}
          />
          <MetricCard
            label="Stations"
            value={`${analytics.stationsCompleted}/${analytics.stationsTotal}`}
            sub="completed"
            icon={MapPin}
          />
        </div>
      ) : null}

      {/* Terrain & Elevation Profile Section */}
      <TerrainElevationSection
        trainNumber={trainNumber}
        currentPositionKm={liveData?.progress.distanceCoveredKm}
      />

      {/* Delay History sparkline (text based for now) */}
      {analytics?.delayHistory && analytics.delayHistory.length > 1 && (
        <div className="bg-white rounded-md border border-[#E5E7EB] shadow-card p-5">
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-3">
            Delay Trend
          </p>
          <p className="text-sm text-[#6B7280]">{getDelayTrendSentence(analytics)}</p>
          <div className="mt-3 flex items-center gap-2">
            {analytics.delayHistory.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-1.5 rounded-pill",
                    d.delayMinutes > 10 ? "bg-amber-400" :
                    d.delayMinutes > 0 ? "bg-amber-200" :
                    "bg-green-400"
                  )}
                  style={{ height: `${Math.max(8, Math.min(40, Math.abs(d.delayMinutes) * 2))}px` }}
                  title={`${d.stationName}: ${d.delayMinutes > 0 ? "+" : ""}${d.delayMinutes} min`}
                />
                <span className="text-[9px] text-[#9CA3AF] truncate w-10 text-center">
                  {d.stationCode}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helper components ─────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white rounded-md border border-[#E5E7EB] shadow-card p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-[#D1D5DB]" aria-hidden="true" />
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className={cn("text-xl font-bold tabular-nums", highlight ? "text-amber-600" : "text-[#111318]")}>
        {value}
      </p>
      <p className="text-xs text-[#9CA3AF] mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDelay(minutes: number): string {
  if (minutes === 0) return "On Time";
  const sign = minutes > 0 ? "+" : "";
  return `${sign}${minutes} min`;
}

function getDelayTrend(analytics: TrainAnalytics): string {
  const history = analytics.delayHistory;
  if (history.length < 2) return "";
  const first = history[0].delayMinutes;
  const last = history[history.length - 1].delayMinutes;
  if (last > first) return "increasing";
  if (last < first) return "decreasing";
  return "stable";
}

function getDelayTrendSentence(analytics: TrainAnalytics): string {
  const history = analytics.delayHistory;
  if (history.length < 2) return "Insufficient data for trend analysis.";
  const first = history[0].delayMinutes;
  const last = history[history.length - 1].delayMinutes;
  const diff = Math.abs(last - first);
  if (last < first) return `Delay reduced by ${diff} minutes over the last ${history.length} stations.`;
  if (last > first) return `Delay increased by ${diff} minutes over the last ${history.length} stations.`;
  return "Delay has remained stable across recent stations.";
}
