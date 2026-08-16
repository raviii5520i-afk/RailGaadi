"use client";

import { useTrainStatus } from "@/hooks/useTrainStatus";
import { TrainHeader } from "@/components/train/TrainHeader";
import { JourneyTabs } from "@/components/train/JourneyTabs";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface JourneyLayoutShellProps {
  trainNumber: string;
  children: React.ReactNode;
}

export function JourneyLayoutShell({ trainNumber, children }: JourneyLayoutShellProps) {
  const { data: liveData, isLoading } = useTrainStatus(trainNumber);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Shared header with train info */}
      {isLoading ? (
        <div className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F3F4F6] rounded-md skeleton flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 skeleton rounded-sm" />
              <div className="h-5 w-48 skeleton rounded-sm" />
            </div>
          </div>
        </div>
      ) : liveData ? (
        <TrainHeader data={liveData} />
      ) : null}

      {/* Journey section tabs */}
      <JourneyTabs trainNumber={trainNumber} />

      {/* Page content */}
      <main>{children}</main>
    </div>
  );
}
