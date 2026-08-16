"use client";

import { useQuery } from "@tanstack/react-query";
import { searchTrains } from "@/services/searchService";
import { APP_CONFIG } from "@/constants/config";

export function useTrainSearch(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["train-search", trimmed],
    queryFn: () => searchTrains(trimmed),
    enabled: trimmed.length >= APP_CONFIG.search.minChars,
    staleTime: APP_CONFIG.cache.search * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev, // keep previous results while searching
  });
}
