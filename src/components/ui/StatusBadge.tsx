import { cn } from "@/utils/cn";
import type { TrainState } from "@/types/train";

const STATUS_CONFIG: Record<
  TrainState,
  { label: string; className: string; dot: string }
> = {
  ON_TIME: {
    label: "On Time",
    className: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  DELAYED: {
    label: "Delayed",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  EARLY: {
    label: "Early",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  HALTED: {
    label: "Halted",
    className: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  NOT_STARTED: {
    label: "Not Started",
    className: "bg-gray-50 text-gray-500 border-gray-200",
    dot: "bg-gray-300",
  },
  UNKNOWN: {
    label: "Unknown",
    className: "bg-gray-50 text-gray-400 border-gray-200",
    dot: "bg-gray-300",
  },
};

interface StatusBadgeProps {
  state: TrainState;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ state, className, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[state] ?? STATUS_CONFIG.UNKNOWN;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border font-medium tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs",
        config.className,
        className
      )}
      role="status"
      aria-label={`Train status: ${config.label}`}
    >
      <span
        className={cn(
          "rounded-full flex-shrink-0",
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
          config.dot,
          state === "ON_TIME" || state === "DELAYED" ? "animate-pulse" : ""
        )}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}

interface DelayBadgeProps {
  minutes: number;
  className?: string;
}

export function DelayBadge({ minutes, className }: DelayBadgeProps) {
  if (minutes === 0) return null;

  const isPositive = minutes > 0;
  const absMinutes = Math.abs(minutes);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-semibold",
        isPositive
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-green-50 text-green-700 border border-green-200",
        className
      )}
      aria-label={`${isPositive ? "Delayed" : "Early"} by ${absMinutes} minutes`}
    >
      {isPositive ? "+" : "−"}{absMinutes} min
    </span>
  );
}
