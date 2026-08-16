import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_SEARCH_RESULTS } from "@/providers/mock/mockData";
import { env } from "@/constants/env";
import type { ApiResponse } from "@/types/api";
import type { TrainSearchResult } from "@/types/train";

const querySchema = z.object({
  q: z.string().min(2).max(100),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({ q: searchParams.get("q") });

    if (!parsed.success) {
      const response: ApiResponse<never> = {
        error: {
          code: "VALIDATION_ERROR",
          message: "Search query must be at least 2 characters.",
          retryable: false,
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { q } = parsed.data;
    const lowerQ = q.toLowerCase().trim();

    if (env.MOCK_MODE) {
      const results = MOCK_SEARCH_RESULTS.filter(
        (t) =>
          t.trainNumber.includes(lowerQ) ||
          t.name.toLowerCase().includes(lowerQ) ||
          t.origin.name.toLowerCase().includes(lowerQ) ||
          t.destination.name.toLowerCase().includes(lowerQ)
      );
      const response: ApiResponse<TrainSearchResult[]> = { data: results };
      return NextResponse.json(response, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      });
    }

    // Live search: If query contains numbers (e.g. 12951, 12301, 12141), query RailRadar live API
    if (/^\d{4,5}$/.test(lowerQ)) {
      const paddedNumber = lowerQ.length === 4 ? `0${lowerQ}` : lowerQ;
      try {
        const railResponse = await fetch(
          `${env.RAILRADAR_BASE_URL}/trains/${paddedNumber}`,
          {
            headers: { "x-api-key": env.RAILRADAR_API_KEY },
            signal: AbortSignal.timeout(8000),
          }
        );

        if (railResponse.ok) {
          const resJson = await railResponse.json();
          if (resJson.success && resJson.data?.train) {
            const tr = resJson.data.train;
            const singleResult: TrainSearchResult = {
              trainNumber: tr.number ?? paddedNumber,
              name: tr.name ?? `Train ${paddedNumber}`,
              origin: {
                id: tr.source?.code ?? "",
                code: tr.source?.code ?? "",
                name: tr.source?.name ?? "Origin",
                latitude: tr.source?.lat,
                longitude: tr.source?.lng,
              },
              destination: {
                id: tr.destination?.code ?? "",
                code: tr.destination?.code ?? "",
                name: tr.destination?.name ?? "Destination",
                latitude: tr.destination?.lat,
                longitude: tr.destination?.lng,
              },
              type: tr.type ?? "Express",
            };
            return NextResponse.json({ data: [singleResult] });
          }
        }
      } catch {
        // Fallback to local search below
      }
    }

    // Filter matching train database dynamically
    const results = MOCK_SEARCH_RESULTS.filter(
      (t) =>
        t.trainNumber.includes(lowerQ) ||
        t.name.toLowerCase().includes(lowerQ) ||
        t.origin.name.toLowerCase().includes(lowerQ) ||
        t.destination.name.toLowerCase().includes(lowerQ)
    );

    const response: ApiResponse<TrainSearchResult[]> = { data: results };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    const response: ApiResponse<never> = {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred during search.",
        retryable: true,
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
