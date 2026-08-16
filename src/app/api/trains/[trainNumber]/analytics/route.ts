import { NextRequest, NextResponse } from "next/server";
import { MOCK_ANALYTICS } from "@/providers/mock/mockData";
import { env } from "@/constants/env";
import type { ApiResponse } from "@/types/api";
import type { TrainAnalytics, DelayDataPoint } from "@/types/train";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trainNumber: string }> }
) {
  const { trainNumber } = await params;
  try {
    if (env.MOCK_MODE) {
      const response: ApiResponse<TrainAnalytics> = { data: MOCK_ANALYTICS };
      return NextResponse.json(response, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      });
    }

    // Fetch live data from RailRadar
    const railRes = await fetch(
      `${env.RAILRADAR_BASE_URL}/trains/${trainNumber}/live`,
      {
        headers: { "x-api-key": env.RAILRADAR_API_KEY },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (railRes.ok) {
      const resJson = await railRes.json();
      if (resJson.success && resJson.data) {
        const rr = resJson.data;
        const curLoc = rr.currentLocation ?? {};
        const schedule = Array.isArray(rr.schedule) ? rr.schedule : [];

        const totalDist = rr.train?.distance ?? 1200;
        const distCovered = curLoc.distance ?? 0;
        const distRem = Math.max(0, totalDist - distCovered);
        const percentage = Math.min(100, Math.round((distCovered / totalDist) * 100));

        // Build delay history from schedule
        const delayHistory: DelayDataPoint[] = schedule
          .filter((s: { actualArrival?: string; delayArrival?: number }) => s.actualArrival || s.delayArrival !== undefined)
          .slice(0, 10)
          .map((s: { stationName?: string; stationCode?: string; delayArrival?: number }) => ({
            stationName: s.stationName ?? "Station",
            stationCode: s.stationCode ?? "",
            delayMinutes: s.delayArrival ?? 0,
            timestamp: new Date().toISOString(),
          }));

        const analytics: TrainAnalytics = {
          progress: {
            percentage,
            totalDistanceKm: totalDist,
            distanceCoveredKm: distCovered,
            distanceRemainingKm: distRem,
          },
          delayHistory: delayHistory.length > 0 ? delayHistory : [
            { stationName: curLoc.stationName ?? "Origin", stationCode: curLoc.stationCode ?? "ORIGIN", delayMinutes: curLoc.delayMinutes ?? 0, timestamp: new Date().toISOString() }
          ],
          stationsCompleted: curLoc.sequence ?? 1,
          stationsTotal: Math.max(1, schedule.length),
          travelDurationMinutes: rr.train?.duration ?? 900,
          estimatedArrivalMinutes: Math.round(distRem / 0.8), // ~80 km/h avg speed
          highestElevationM: 657,
          currentElevationM: 140,
        };

        return NextResponse.json({ data: analytics });
      }
    }

    // Static fallback calculations if live status is not running
    const staticRes = await fetch(
      `${env.RAILRADAR_BASE_URL}/trains/${trainNumber}`,
      {
        headers: { "x-api-key": env.RAILRADAR_API_KEY },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (staticRes.ok) {
      const resJson = await staticRes.json();
      if (resJson.success && resJson.data?.train) {
        const tr = resJson.data.train;
        const routeList = resJson.data.route ?? [];
        const analytics: TrainAnalytics = {
          progress: {
            percentage: 0,
            totalDistanceKm: tr.distance ?? 1000,
            distanceCoveredKm: 0,
            distanceRemainingKm: tr.distance ?? 1000,
          },
          delayHistory: [
            { stationName: tr.source?.name ?? "Origin", stationCode: tr.source?.code ?? "", delayMinutes: 0, timestamp: new Date().toISOString() }
          ],
          stationsCompleted: 0,
          stationsTotal: Math.max(1, routeList.length),
          travelDurationMinutes: tr.duration ?? 900,
          estimatedArrivalMinutes: tr.duration ?? 900,
          highestElevationM: 620,
          currentElevationM: 15,
        };
        return NextResponse.json({ data: analytics });
      }
    }

    return NextResponse.json({ data: MOCK_ANALYTICS });
  } catch {
    return NextResponse.json({ data: MOCK_ANALYTICS });
  }
}
