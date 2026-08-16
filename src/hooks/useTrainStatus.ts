"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getTrainStatus, getTrainRoute } from "@/services/trainService";
import { APP_CONFIG } from "@/constants/config";

export function useTrainStatus(trainNumber: string) {
  const visibilityRef = useRef(
    typeof document !== "undefined"
      ? document.visibilityState === "visible"
      : true
  );

  // Track page visibility
  useEffect(() => {
    const handler = () => {
      visibilityRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return useQuery({
    queryKey: ["train-status", trainNumber],
    queryFn: () => getTrainStatus(trainNumber),
    enabled: !!trainNumber,
    staleTime: APP_CONFIG.cache.liveStatus * 1000,
    refetchInterval: (query) => {
      if (!visibilityRef.current) {
        return APP_CONFIG.refresh.backgroundTab;
      }
      if (
        query.state.data?.status.state === "COMPLETED" ||
        query.state.data?.status.state === "NOT_STARTED"
      ) {
        return APP_CONFIG.refresh.inactiveJourney;
      }
      return APP_CONFIG.refresh.activeJourney;
    },
    refetchIntervalInBackground: false,
    retry: (failureCount, error: unknown) => {
      if (error && typeof error === "object" && "code" in error) {
        const code = (error as { code: string }).code;
        if (["TRAIN_NOT_FOUND", "INVALID_TRAIN"].includes(code)) return false;
      }
      return failureCount < 3;
    },
  });
}

export function useTrainRoute(trainNumber: string) {
  return useQuery({
    queryKey: ["train-route", trainNumber],
    queryFn: () => getTrainRoute(trainNumber),
    enabled: !!trainNumber,
    staleTime: APP_CONFIG.cache.route * 1000,
    gcTime: 24 * 60 * 60 * 1000, // 24h
    retry: 2,
  });
}
