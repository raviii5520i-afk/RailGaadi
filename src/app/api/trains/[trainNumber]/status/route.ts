import { NextRequest, NextResponse } from "next/server";
import { env } from "@/constants/env";
import type { ApiResponse } from "@/types/api";
import type { LiveTrainData, TrainState } from "@/types/train";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trainNumber: string }> }
) {
  const { trainNumber } = await params;
  try {
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

    // 1. Fetch static train schedule from RailRadar API to build exact station coordinate lookup
    const staticMap = await fetchStationCoordinateMap(trainNumber);

    // 2. Fetch RailRadar Live Endpoint
    let liveRes: Response | null = null;
    try {
      liveRes = await fetch(
        `${env.RAILRADAR_BASE_URL}/trains/${trainNumber}/live`,
        {
          headers: { "x-api-key": env.RAILRADAR_API_KEY },
          signal: AbortSignal.timeout(8000),
        }
      );
    } catch {
      // Live API endpoint failed or timed out
    }

    if (liveRes && liveRes.ok) {
      const resJson = await liveRes.json();
      if (resJson.success && resJson.data) {
        const rr = resJson.data;
        const tr = rr.train ?? {};
        const curLoc = rr.currentLocation ?? {};
        const nextHalt = rr.nextHalt ?? {};
        const routeList = rr.route ?? rr.schedule ?? [];

        let state: TrainState = "ON_TIME";
        const delay = curLoc.delayMinutes ?? rr.delayMinutes ?? 0;
        if (rr.status === "completed") state = "COMPLETED";
        else if (rr.status === "not-started") state = "NOT_STARTED";
        else if (curLoc.status === "halted") state = "HALTED";
        else if (delay > 5) state = "DELAYED";
        else if (delay < 0) state = "EARLY";

        const currentCode = curLoc.stationCode || (routeList[0]?.stationCode ?? "");
        const nextCode = nextHalt.stationCode || (routeList[1]?.stationCode ?? "");

        const curCoords = staticMap.get(currentCode) || {
          lat: tr.source?.lat ?? 20.5937,
          lng: tr.source?.lng ?? 78.9629,
          name: curLoc.stationName || currentCode,
        };

        const nextCoords = staticMap.get(nextCode) || {
          lat: tr.destination?.lat ?? curCoords.lat,
          lng: tr.destination?.lng ?? curCoords.lng,
          name: nextHalt.stationName || nextCode,
        };

        const totalDist = tr.distance ?? 1000;
        const curDist = curLoc.distance ?? 0;
        const seq = curLoc.sequence ?? 1;
        const totalSeq = Math.max(1, routeList.length || 1);
        const progressPct = Math.min(100, Math.max(0, Math.round((seq / totalSeq) * 100)));

        const liveData: LiveTrainData = {
          train: {
            id: tr.number ?? trainNumber,
            number: tr.number ?? trainNumber,
            name: tr.name ?? `Train ${trainNumber}`,
            type: tr.type ?? "Express",
            origin: {
              id: tr.source?.code ?? "",
              code: tr.source?.code ?? "",
              name: tr.source?.name ?? curCoords.name,
              latitude: tr.source?.lat ?? curCoords.lat,
              longitude: tr.source?.lng ?? curCoords.lng,
            },
            destination: {
              id: tr.destination?.code ?? "",
              code: tr.destination?.code ?? "",
              name: tr.destination?.name ?? "Destination",
              latitude: tr.destination?.lat,
              longitude: tr.destination?.lng,
            },
          },
          status: {
            state,
            delayMinutes: delay,
            currentStation: {
              id: currentCode,
              code: currentCode,
              name: curLoc.stationName || curCoords.name,
              latitude: curCoords.lat,
              longitude: curCoords.lng,
            },
            nextStation: {
              id: nextCode,
              code: nextCode,
              name: nextHalt.stationName || nextCoords.name,
              latitude: nextCoords.lat,
              longitude: nextCoords.lng,
            },
            lastUpdated: rr.lastUpdatedAt ?? new Date().toISOString(),
            dataSource: "live",
          },
          location: {
            latitude: curCoords.lat,
            longitude: curCoords.lng,
            timestamp: rr.lastUpdatedAt ?? new Date().toISOString(),
            speed: curLoc.speedToNextStationKmph ?? 0,
          },
          progress: {
            percentage: progressPct,
            totalDistanceKm: totalDist,
            distanceCoveredKm: curDist,
            distanceRemainingKm: Math.max(0, totalDist - curDist),
          },
        };

        return NextResponse.json({ data: liveData });
      }
    }

    // 3. Fetch static train info from RailRadar API (/v1/trains/{trainNumber})
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
        const first = routeList[0]?.station ?? tr.source ?? {};
        const second = routeList[1]?.station ?? {};

        const firstLat = first.lat ?? tr.source?.lat ?? 20.5937;
        const firstLng = first.lng ?? tr.source?.lng ?? 78.9629;

        const trainData: LiveTrainData = {
          train: {
            id: tr.number ?? trainNumber,
            number: tr.number ?? trainNumber,
            name: tr.name ?? `Train ${trainNumber}`,
            type: tr.type ?? "Express",
            origin: {
              id: tr.source?.code ?? "",
              code: tr.source?.code ?? "",
              name: tr.source?.name ?? "",
              latitude: tr.source?.lat,
              longitude: tr.source?.lng,
            },
            destination: {
              id: tr.destination?.code ?? "",
              code: tr.destination?.code ?? "",
              name: tr.destination?.name ?? "",
              latitude: tr.destination?.lat,
              longitude: tr.destination?.lng,
            },
          },
          status: {
            state: "ON_TIME",
            delayMinutes: 0,
            currentStation: {
              id: first.code ?? "",
              code: first.code ?? "",
              name: first.name ?? "",
              latitude: firstLat,
              longitude: firstLng,
            },
            nextStation: {
              id: second.code ?? "",
              code: second.code ?? "",
              name: second.name ?? "",
              latitude: second.lat,
              longitude: second.lng,
            },
            lastUpdated: new Date().toISOString(),
            dataSource: "scheduled",
          },
          location: {
            latitude: firstLat,
            longitude: firstLng,
            timestamp: new Date().toISOString(),
            speed: 0,
          },
          progress: {
            percentage: 0,
            totalDistanceKm: tr.distance ?? 1000,
            distanceCoveredKm: 0,
            distanceRemainingKm: tr.distance ?? 1000,
          },
        };

        return NextResponse.json({ data: trainData });
      }
    }

    const response: ApiResponse<never> = {
      error: {
        code: "TRAIN_NOT_FOUND",
        message: `Train ${trainNumber} not found in RailRadar database.`,
        retryable: false,
      },
    };
    return NextResponse.json(response, { status: 404 });
  } catch {
    const response: ApiResponse<never> = {
      error: {
        code: "STATUS_UNAVAILABLE",
        message: "Failed to load train details from RailRadar API.",
        retryable: true,
      },
    };
    return NextResponse.json(response, { status: 503 });
  }
}

/** Helper to fetch station coordinate lookup map from static RailRadar API endpoint */
async function fetchStationCoordinateMap(
  trainNumber: string
): Promise<Map<string, { lat: number; lng: number; name: string }>> {
  const map = new Map<string, { lat: number; lng: number; name: string }>();
  try {
    const res = await fetch(
      `${env.RAILRADAR_BASE_URL}/trains/${trainNumber}`,
      {
        headers: { "x-api-key": env.RAILRADAR_API_KEY },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (res.ok) {
      const json = await res.json();
      const route = json.data?.route ?? [];
      for (const item of route) {
        if (item.station?.code) {
          map.set(item.station.code, {
            lat: item.station.lat ?? 20.5937,
            lng: item.station.lng ?? 78.9629,
            name: item.station.name ?? item.station.code,
          });
        }
      }
    }
  } catch {
    // Return empty map on failure
  }
  return map;
}
