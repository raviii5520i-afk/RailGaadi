"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Filter, ArrowUpDown, Train, Navigation2, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import type { TrainsBetweenResponseData, TrainBetweenItem } from "@/app/api/trains/between/route";
import type { ApiResponse } from "@/types/api";

interface TrainsBetweenContentProps {
  fromCode: string;
  toCode: string;
  initialDate?: string;
  initialTime?: string;
}

export function TrainsBetweenContent({
  fromCode,
  toCode,
  initialDate,
  initialTime,
}: TrainsBetweenContentProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"dep" | "dur" | "arr">("dep");
  const [filterType, setFilterType] = useState<string>("ALL");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["trains-between", fromCode, toCode],
    queryFn: async (): Promise<TrainsBetweenResponseData | null> => {
      const res = await fetch(`/api/trains/between?from=${fromCode}&to=${toCode}`);
      const json: ApiResponse<TrainsBetweenResponseData> = await res.json();
      return json.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleTrackLive = (trainNumber: string) => {
    router.push(`/journey/${trainNumber}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
        <div className="h-6 w-36 bg-[#F3F4F6] rounded-sm skeleton" />
        <div className="h-16 bg-[#F3F4F6] rounded-md skeleton" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data || !data.trains) {
    return (
      <div className="text-center py-16 max-w-sm mx-auto">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#111318] mb-1">No direct trains found</h2>
        <p className="text-xs text-[#9CA3AF] mb-6">
          We couldn&apos;t find direct trains between {fromCode} and {toCode}. Try checking station codes or dates.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>
      </div>
    );
  }

  // Filter & Sort
  let trainsList = [...data.trains];

  if (filterType !== "ALL") {
    const filtered = trainsList.filter(
      (t) =>
        t.type.toUpperCase().includes(filterType.toUpperCase()) ||
        t.category.toUpperCase().includes(filterType.toUpperCase()) ||
        t.name.toUpperCase().includes(filterType.toUpperCase())
    );
    if (filtered.length > 0) {
      trainsList = filtered;
    }
  }

  if (sortBy === "dep") {
    trainsList.sort((a, b) => a.departure.localeCompare(b.departure));
  } else if (sortBy === "dur") {
    trainsList.sort((a, b) => a.durationMinutes - b.durationMinutes);
  } else if (sortBy === "arr") {
    trainsList.sort((a, b) => a.arrival.localeCompare(b.arrival));
  }

  return (
    <div className="space-y-5 animate-[fade-in_0.3s_ease-out]">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111318] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-md border border-[#E5E7EB] p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-[#111318]">
            <span>{data.from.name}</span>
            <span className="font-mono text-xs bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-sm">
              {data.from.code}
            </span>
            <ArrowRight className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <span>{data.to.name}</span>
            <span className="font-mono text-xs bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-sm">
              {data.to.code}
            </span>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">
            {trainsList.length} direct trains found operating on this route
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F8F9FB] border border-[#E5E7EB] rounded-pill text-xs font-medium text-[#6B7280]">
            <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
            Today
          </span>
        </div>
      </div>

      {/* Sort & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-md border border-[#E5E7EB] shadow-card">
        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#9CA3AF] font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#2563EB]" /> Sort:
          </span>
          <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-sm">
            <SortButton active={sortBy === "dep"} onClick={() => setSortBy("dep")}>
              Departure
            </SortButton>
            <SortButton active={sortBy === "dur"} onClick={() => setSortBy("dur")}>
              Duration
            </SortButton>
            <SortButton active={sortBy === "arr"} onClick={() => setSortBy("arr")}>
              Arrival
            </SortButton>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#9CA3AF] font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#2563EB]" /> Filter:
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-8 px-2 bg-white border border-[#E5E7EB] rounded-sm text-xs font-semibold text-[#111318] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="ALL">All Trains</option>
            <option value="RAJDHANI">Rajdhani Express</option>
            <option value="SHATABDI">Shatabdi Express</option>
            <option value="VANDE BHARAT">Vande Bharat</option>
            <option value="SUPERFAST">Superfast</option>
          </select>
        </div>
      </div>

      {/* Train Cards List */}
      <div className="space-y-3">
        {trainsList.map((t) => (
          <TrainBetweenCard key={t.number} train={t} onTrack={handleTrackLive} />
        ))}
      </div>
    </div>
  );
}

function TrainBetweenCard({
  train,
  onTrack,
}: {
  train: TrainBetweenItem;
  onTrack: (number: string) => void;
}) {
  return (
    <div className="bg-white rounded-md border border-[#E5E7EB] hover:border-[#93C5FD] shadow-card hover:shadow-card-hover p-4 sm:p-5 transition-all duration-micro space-y-4">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EFF6FF] rounded-md flex items-center justify-center flex-shrink-0">
            <Train className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#111318]">{train.number}</span>
              <span className="text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-sm">
                {train.type}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#111318] mt-0.5">{train.name}</h3>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-pill flex-shrink-0">
          Runs Daily
        </span>
      </div>

      {/* Timings & Duration Row */}
      <div className="flex items-center justify-between bg-[#F8F9FB] p-3.5 rounded-sm border border-[#E5E7EB]">
        {/* Departure */}
        <div>
          <p className="text-xs text-[#9CA3AF]">Departs ({train.sourceCode})</p>
          <p className="text-lg font-extrabold text-[#111318] mt-0.5 tabular-nums">{train.departure}</p>
        </div>

        {/* Duration Visual Line */}
        <div className="flex-1 max-w-[140px] px-3 text-center">
          <p className="text-[11px] font-semibold text-[#6B7280]">{train.duration}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <div className="flex-1 h-0.5 bg-[#2563EB]" />
            <ArrowRight className="w-3 h-3 text-[#2563EB]" />
          </div>
        </div>

        {/* Arrival */}
        <div className="text-right">
          <p className="text-xs text-[#9CA3AF]">Arrives ({train.destinationCode})</p>
          <p className="text-lg font-extrabold text-[#111318] mt-0.5 tabular-nums">{train.arrival}</p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-[#9CA3AF]">
          Distance: <strong className="text-[#6B7280]">{train.distanceKm} km</strong>
        </span>

        <button
          type="button"
          onClick={() => onTrack(train.number)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-sm shadow-xs transition-colors duration-micro"
        >
          <Navigation2 className="w-3.5 h-3.5" />
          Track Live →
        </button>
      </div>
    </div>
  );
}

function SortButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-sm text-xs font-bold transition-all duration-micro",
        active ? "bg-white text-[#2563EB] shadow-xs" : "text-[#6B7280] hover:text-[#111318]"
      )}
    >
      {children}
    </button>
  );
}
