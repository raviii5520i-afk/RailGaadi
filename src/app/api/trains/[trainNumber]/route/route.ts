import { NextRequest, NextResponse } from "next/server";
import { env } from "@/constants/env";
import type { ApiResponse } from "@/types/api";
import type { TrainRoute, StationSchedule } from "@/types/train";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trainNumber: string }> }
) {
  try {
    const { trainNumber } = await params;

    if (!trainNumber || !/^\d{4,5}$/.test(trainNumber)) {
      const response: ApiResponse<never> = {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid train number format.",
          retryable: false,
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 1. Try Live Endpoint
    try {
      const liveRes = await fetch(
        `${env.RAILRADAR_BASE_URL}/trains/${trainNumber}/live`,
        {
          headers: { "x-api-key": env.RAILRADAR_API_KEY },
          signal: AbortSignal.timeout(6000),
        }
      );

      if (liveRes.ok) {
        const resJson = await liveRes.json();
        if (resJson.success && resJson.data && Array.isArray(resJson.data.schedule) && resJson.data.schedule.length > 0) {
          const rr = resJson.data;
          const routeData = parseRailRadarSchedule(trainNumber, rr.train, rr.schedule);
          return NextResponse.json({ data: routeData });
        }
      }
    } catch {
      // Fallback to static train endpoint below
    }

    // 2. Fetch Static Train Route Endpoint (/v1/trains/{trainNumber})
    const staticRes = await fetch(
      `${env.RAILRADAR_BASE_URL}/trains/${trainNumber}`,
      {
        headers: { "x-api-key": env.RAILRADAR_API_KEY },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (staticRes.ok) {
      const resJson = await staticRes.json();
      if (resJson.success && resJson.data) {
        const rr = resJson.data;
        const routeData = parseRailRadarSchedule(trainNumber, rr.train, rr.route);
        return NextResponse.json({ data: routeData });
      }
    }

    const response: ApiResponse<never> = {
      error: {
        code: "TRAIN_NOT_FOUND",
        message: `Route for train ${trainNumber} not found.`,
        retryable: false,
      },
    };
    return NextResponse.json(response, { status: 404 });
  } catch {
    const response: ApiResponse<never> = {
      error: {
        code: "STATUS_UNAVAILABLE",
        message: "Failed to load station route timeline.",
        retryable: true,
      },
    };
    return NextResponse.json(response, { status: 503 });
  }
}

/** Parse RailRadar route/schedule array into RailGaadi TrainRoute interface */
function parseRailRadarSchedule(
  trainNumber: string,
  trainMeta: any,
  rawSchedule: any[]
): TrainRoute {
  // Filter halting stations or major stops if schedule is very long (or keep all halts)
  const haltsOnly = rawSchedule.filter((s) => s.isHalt || s.sequence === 1 || s.sequence === rawSchedule.length);
  const itemsToUse = haltsOnly.length >= 2 ? haltsOnly : rawSchedule;

  const stations: StationSchedule[] = itemsToUse.map((s, idx) => {
    const st = s.station ?? {};
    return {
      station: {
        id: s.stationCode ?? st.code ?? `STN_${idx}`,
        code: s.stationCode ?? st.code ?? "",
        name: s.stationName ?? st.name ?? `Station ${idx + 1}`,
        latitude: st.lat,
        longitude: st.lng,
      },
      scheduledArrival: s.arrival || s.scheduledArrival,
      scheduledDeparture: s.departure || s.scheduledDeparture,
      actualArrival: s.actualArrival,
      actualDeparture: s.actualDeparture,
      delayMinutes: s.delayArrival ?? 0,
      distanceFromOriginKm: s.distance ?? 0,
      status: s.status === "completed" ? "completed" : s.status === "current" ? "current" : "upcoming",
      platform: s.platform,
    };
  });

  const coordinates = itemsToUse
    .filter((s) => (s.station?.lat || s.lat) && (s.station?.lng || s.lng))
    .map((s) => [s.station?.lng ?? s.lng, s.station?.lat ?? s.lat]);

  return {
    trainNumber,
    totalDistanceKm: trainMeta?.distance ?? stations.at(-1)?.distanceFromOriginKm ?? 1000,
    stations,
    geometry: coordinates.length > 1 ? { type: "LineString", coordinates } : undefined,
  };
}
