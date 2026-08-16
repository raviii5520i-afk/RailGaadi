import type { LiveTrainData, TrainRoute } from "@/types/train";
import type { ApiResponse } from "@/types/api";
import { MOCK_LIVE_TRAIN_DATA, MOCK_TRAIN_ROUTE } from "@/providers/mock/mockData";
import { env } from "@/constants/env";

export async function getTrainStatus(
  trainNumber: string
): Promise<LiveTrainData> {
  if (env.MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      ...MOCK_LIVE_TRAIN_DATA,
      status: {
        ...MOCK_LIVE_TRAIN_DATA.status,
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  const response = await fetch(`/api/trains/${trainNumber}/status`);
  if (!response.ok) {
    const json: ApiResponse<never> = await response.json();
    throw json.error ?? new Error("Failed to fetch train status");
  }
  const json: ApiResponse<LiveTrainData> = await response.json();
  if (json.error) throw json.error;
  return json.data!;
}

export async function getTrainRoute(
  trainNumber: string
): Promise<TrainRoute> {
  if (env.MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_TRAIN_ROUTE;
  }

  const response = await fetch(`/api/trains/${trainNumber}/route`);
  const json: ApiResponse<TrainRoute> = await response.json();
  if (json.error) throw json.error;
  return json.data!;
}
