import type { TrainSearchResult } from "@/types/train";
import type { ApiResponse } from "@/types/api";
import { MOCK_SEARCH_RESULTS } from "@/providers/mock/mockData";
import { env } from "@/constants/env";

export async function searchTrains(
  query: string
): Promise<TrainSearchResult[]> {
  if (env.MOCK_MODE) {
    // Simulate network latency in mock mode
    await new Promise((r) => setTimeout(r, 400));
    const q = query.toLowerCase();
    return MOCK_SEARCH_RESULTS.filter(
      (t) =>
        t.trainNumber.includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.origin.name.toLowerCase().includes(q) ||
        t.destination.name.toLowerCase().includes(q)
    );
  }

  const response = await fetch(
    `/api/trains/search?q=${encodeURIComponent(query)}`
  );
  const json: ApiResponse<TrainSearchResult[]> = await response.json();
  if (json.error) throw json.error;
  return json.data ?? [];
}
