// All environment variables — validated at startup
// Server-side vars are only available in API routes / Server Components
// Public vars are safe for client use

export const env = {
  // Server-side
  RAILRADAR_API_KEY: process.env.RAILRADAR_API_KEY ?? "mock",
  RAILRADAR_BASE_URL: process.env.RAILRADAR_BASE_URL ?? "https://api.railradar.in/v1",
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY ?? "mock",
  OPENTOPOGRAPHY_API_KEY: process.env.OPENTOPOGRAPHY_API_KEY ?? "mock",

  // Client-safe
  MAPTILER_API_KEY: process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? "",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  MOCK_MODE: process.env.NEXT_PUBLIC_MOCK_MODE === "true",
} as const;

export type Env = typeof env;
