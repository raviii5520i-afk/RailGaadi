import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_NEARBY_FEATURES } from "@/providers/mock/mockData";
import { env } from "@/constants/env";
import type { ApiResponse } from "@/types/api";
import type { GeographicFeature } from "@/types/train";

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1).max(100).default(15),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      lat: searchParams.get("lat"),
      lon: searchParams.get("lon"),
      radius: searchParams.get("radius"),
    });

    if (!parsed.success) {
      const response: ApiResponse<never> = {
        error: {
          code: "VALIDATION_ERROR",
          message: "Valid lat, lon parameters are required.",
          retryable: false,
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (env.MOCK_MODE) {
      const response: ApiResponse<GeographicFeature[]> = {
        data: MOCK_NEARBY_FEATURES,
      };
      return NextResponse.json(response, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
      });
    }

    const { lat, lon, radius } = parsed.data;

    // Overpass QL query for nearby features
    const overpassQuery = `
      [out:json][timeout:15];
      (
        way["waterway"="river"](around:${radius * 1000},${lat},${lon});
        node["natural"="peak"](around:${radius * 1000},${lat},${lon});
        node["railway"="bridge"](around:${radius * 1000},${lat},${lon});
        node["historic"](around:${radius * 1000},${lat},${lon});
        node["tourism"="attraction"](around:${radius * 1000},${lat},${lon});
      );
      out center 20;
    `;

    const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(15_000),
    });

    if (!overpassRes.ok) {
      const response: ApiResponse<GeographicFeature[]> = { data: [] };
      return NextResponse.json(response);
    }

    const overpassData = await overpassRes.json();
    const features: GeographicFeature[] = overpassData.elements
      .filter((el: Record<string, unknown>) => el.tags && (el as { tags: Record<string, string> }).tags.name)
      .slice(0, 10)
      .map((el: Record<string, unknown>) => {
        const tags = (el as { tags: Record<string, string> }).tags;
        const elLat = (el as { lat?: number; center?: { lat: number } }).lat ?? (el as { center?: { lat: number } }).center?.lat ?? lat;
        const elLon = (el as { lon?: number; center?: { lon: number } }).lon ?? (el as { center?: { lon: number } }).center?.lon ?? lon;
        const distKm = haversineKm(lat, lon, elLat, elLon);

        return {
          id: String((el as { id: unknown }).id),
          name: tags.name,
          type: detectType(tags),
          latitude: elLat,
          longitude: elLon,
          distanceFromTrainKm: distKm,
        } satisfies GeographicFeature;
      });

    const response: ApiResponse<GeographicFeature[]> = { data: features };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch {
    // Geography failure should be silent — return empty, not error
    const response: ApiResponse<GeographicFeature[]> = { data: [] };
    return NextResponse.json(response);
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function detectType(tags: Record<string, string>): GeographicFeature["type"] {
  if (tags.waterway === "river") return "RIVER";
  if (tags.natural === "peak") return "MOUNTAIN";
  if (tags.railway === "bridge") return "BRIDGE";
  if (tags.railway === "tunnel") return "TUNNEL";
  if (tags.historic) return "MONUMENT";
  if (tags.tourism === "attraction") return "ATTRACTION";
  if (tags.place === "city" || tags.place === "town") return "CITY";
  return "ATTRACTION";
}
