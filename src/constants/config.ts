export const APP_CONFIG = {
  name: "RailGaadi",
  tagline: "Real-time Railway Journey Intelligence",
  description: "Live train tracking, interactive maps, weather, and journey analytics for Indian Railways.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  // Refresh intervals (ms)
  refresh: {
    activeJourney: 30_000,       // 30 seconds
    backgroundTab: 120_000,      // 2 minutes
    inactiveJourney: 300_000,    // 5 minutes
  },

  // Search config
  search: {
    debounceMs: 350,
    minChars: 2,
    maxRecent: 10,
    maxFavourites: 20,
  },

  // Map defaults
  map: {
    defaultCenter: [78.9629, 20.5937] as [number, number], // India center
    defaultZoom: 5,
    journeyZoom: 9,
    trainZoom: 12,
    minZoom: 3,
    maxZoom: 18,
    followZoom: 11,
    // MapTiler style URLs
    lightStyle: "https://api.maptiler.com/maps/streets-v2/style.json",
    darkStyle: "https://api.maptiler.com/maps/streets-v2-dark/style.json",
  },

  // API caching
  cache: {
    search: 300,          // 5 min (seconds)
    route: 3600,          // 1 hour
    liveStatus: 30,       // 30 seconds
    weather: 900,         // 15 min
    geography: 3600,      // 1 hour
    elevation: 86400,     // 1 day
  },

  // Retry strategy
  retry: {
    attempts: 3,
    delays: [0, 1000, 3000],
  },

  // Geography
  nearbyRadiusKm: 10,

  // Analytics
  elevationSampleCount: 100,
} as const;

export type AppConfig = typeof APP_CONFIG;
