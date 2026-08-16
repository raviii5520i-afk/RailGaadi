import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/constants/env";
import type { ApiResponse } from "@/types/api";
import type { Weather } from "@/types/train";

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

const MOCK_WEATHER: Weather = {
  temperature: 31,
  feelsLike: 35,
  humidity: 65,
  windSpeed: 12,
  windDirection: 270,
  rainProbability: 30,
  condition: "Partly Cloudy",
  conditionCode: 802,
  timestamp: new Date().toISOString(),
  location: "Vadodara",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      lat: searchParams.get("lat"),
      lon: searchParams.get("lon"),
    });

    if (!parsed.success) {
      const response: ApiResponse<never> = {
        error: {
          code: "VALIDATION_ERROR",
          message: "Valid lat and lon parameters are required.",
          retryable: false,
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (env.MOCK_MODE) {
      const response: ApiResponse<Weather> = { data: MOCK_WEATHER };
      return NextResponse.json(response, {
        headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" },
      });
    }

    const { lat, lon } = parsed.data;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${env.OPENWEATHER_API_KEY}&units=metric`;
    const owRes = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!owRes.ok) {
      const response: ApiResponse<never> = {
        error: {
          code: "WEATHER_UNAVAILABLE",
          message: "Weather data is temporarily unavailable.",
          retryable: true,
        },
      };
      return NextResponse.json(response, { status: 503 });
    }

    const owData = await owRes.json();
    const weather: Weather = {
      temperature: Math.round(owData.main.temp),
      feelsLike: Math.round(owData.main.feels_like),
      humidity: owData.main.humidity,
      windSpeed: Math.round(owData.wind?.speed * 3.6), // m/s → km/h
      windDirection: owData.wind?.deg,
      condition: owData.weather?.[0]?.description ?? "Unknown",
      conditionCode: owData.weather?.[0]?.id,
      timestamp: new Date().toISOString(),
      location: owData.name,
    };

    const response: ApiResponse<Weather> = { data: weather };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" },
    });
  } catch {
    const response: ApiResponse<never> = {
      error: {
        code: "WEATHER_UNAVAILABLE",
        message: "Weather data is temporarily unavailable.",
        retryable: true,
      },
    };
    return NextResponse.json(response, { status: 503 });
  }
}
