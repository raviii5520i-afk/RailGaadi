import { NextRequest, NextResponse } from "next/server";
import { INDIAN_STATIONS, type StationItem } from "@/constants/stations";
import type { ApiResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim() || "";

    if (q.length < 1) {
      const response: ApiResponse<StationItem[]> = { data: INDIAN_STATIONS.slice(0, 8) };
      return NextResponse.json(response);
    }

    const matches = INDIAN_STATIONS.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
    ).slice(0, 10);

    const response: ApiResponse<StationItem[]> = { data: matches };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch {
    const response: ApiResponse<StationItem[]> = { data: [] };
    return NextResponse.json(response);
  }
}
