import type {
  TrainSearchResult,
  LiveTrainData,
  TrainRoute,
  TrainAnalytics,
} from "@/types/train";

// ─── Mock Search Results ──────────────────────────────────────────────────────

export const MOCK_SEARCH_RESULTS: TrainSearchResult[] = [
  {
    trainNumber: "12951",
    name: "Mumbai Rajdhani",
    origin: { id: "BCT", code: "BCT", name: "Mumbai Central", latitude: 18.969, longitude: 72.819 },
    destination: { id: "NDLS", code: "NDLS", name: "New Delhi", latitude: 28.642, longitude: 77.220 },
    departureTime: "17:00",
    type: "Rajdhani",
  },
  {
    trainNumber: "12001",
    name: "Bhopal Shatabdi",
    origin: { id: "NDLS", code: "NDLS", name: "New Delhi", latitude: 28.642, longitude: 77.220 },
    destination: { id: "BPL", code: "BPL", name: "Bhopal Junction", latitude: 23.259, longitude: 77.412 },
    departureTime: "06:00",
    type: "Shatabdi",
  },
  {
    trainNumber: "12621",
    name: "Tamil Nadu Express",
    origin: { id: "NDLS", code: "NDLS", name: "New Delhi", latitude: 28.642, longitude: 77.220 },
    destination: { id: "MAS", code: "MAS", name: "Chennai Central", latitude: 13.083, longitude: 80.275 },
    departureTime: "22:30",
    type: "Superfast",
  },
  {
    trainNumber: "12559",
    name: "Shiv Ganga Express",
    origin: { id: "NDLS", code: "NDLS", name: "New Delhi", latitude: 28.642, longitude: 77.220 },
    destination: { id: "BSB", code: "BSB", name: "Varanasi Junction", latitude: 25.318, longitude: 82.998 },
    departureTime: "18:40",
    type: "Superfast",
  },
  {
    trainNumber: "22691",
    name: "Rajdhani Express",
    origin: { id: "SBC", code: "SBC", name: "Bangalore City", latitude: 12.977, longitude: 77.572 },
    destination: { id: "NDLS", code: "NDLS", name: "New Delhi", latitude: 28.642, longitude: 77.220 },
    departureTime: "20:00",
    type: "Rajdhani",
  },
];

// ─── Mock Live Train Data ─────────────────────────────────────────────────────

export const MOCK_LIVE_TRAIN_DATA: LiveTrainData = {
  train: {
    id: "12951",
    number: "12951",
    name: "Mumbai Rajdhani",
    type: "Rajdhani",
    origin: { id: "BCT", code: "BCT", name: "Mumbai Central", latitude: 18.969, longitude: 72.819 },
    destination: { id: "NDLS", code: "NDLS", name: "New Delhi", latitude: 28.642, longitude: 77.220 },
  },
  status: {
    state: "DELAYED",
    delayMinutes: 12,
    currentStation: {
      id: "BRC",
      code: "BRC",
      name: "Vadodara Junction",
      latitude: 22.307,
      longitude: 73.181,
    },
    nextStation: {
      id: "RTM",
      code: "RTM",
      name: "Ratlam Junction",
      latitude: 23.333,
      longitude: 75.034,
    },
    lastUpdated: new Date(Date.now() - 18_000).toISOString(), // 18 seconds ago
    dataSource: "live",
  },
  location: {
    latitude: 22.307,
    longitude: 73.181,
    timestamp: new Date(Date.now() - 18_000).toISOString(),
    speed: 112,
    heading: 42,
  },
  progress: {
    percentage: 68,
    totalDistanceKm: 1238,
    distanceCoveredKm: 842,
    distanceRemainingKm: 396,
  },
};

// ─── Mock Route ───────────────────────────────────────────────────────────────

export const MOCK_TRAIN_ROUTE: TrainRoute = {
  trainNumber: "12951",
  totalDistanceKm: 1238,
  stations: [
    {
      station: { id: "BCT", code: "BCT", name: "Mumbai Central", latitude: 18.969, longitude: 72.819 },
      scheduledArrival: undefined,
      scheduledDeparture: new Date().toISOString().replace(/T.*/, "T17:00:00.000Z"),
      actualDeparture: new Date().toISOString().replace(/T.*/, "T17:00:00.000Z"),
      delayMinutes: 0,
      distanceFromOriginKm: 0,
      status: "completed",
    },
    {
      station: { id: "ST", code: "ST", name: "Surat", latitude: 21.195, longitude: 72.829 },
      scheduledArrival: new Date().toISOString().replace(/T.*/, "T19:47:00.000Z"),
      scheduledDeparture: new Date().toISOString().replace(/T.*/, "T19:49:00.000Z"),
      actualArrival: new Date().toISOString().replace(/T.*/, "T19:55:00.000Z"),
      actualDeparture: new Date().toISOString().replace(/T.*/, "T19:57:00.000Z"),
      delayMinutes: 8,
      distanceFromOriginKm: 263,
      status: "completed",
      haltDurationMinutes: 2,
    },
    {
      station: { id: "BRC", code: "BRC", name: "Vadodara Junction", latitude: 22.307, longitude: 73.181 },
      scheduledArrival: new Date().toISOString().replace(/T.*/, "T21:15:00.000Z"),
      scheduledDeparture: new Date().toISOString().replace(/T.*/, "T21:20:00.000Z"),
      actualArrival: new Date().toISOString().replace(/T.*/, "T21:23:00.000Z"),
      delayMinutes: 12,
      distanceFromOriginKm: 391,
      status: "current",
      haltDurationMinutes: 5,
    },
    {
      station: { id: "RTM", code: "RTM", name: "Ratlam Junction", latitude: 23.333, longitude: 75.034 },
      scheduledArrival: new Date().toISOString().replace(/T.*/, "T23:30:00.000Z"),
      scheduledDeparture: new Date().toISOString().replace(/T.*/, "T23:35:00.000Z"),
      delayMinutes: 12,
      distanceFromOriginKm: 528,
      status: "upcoming",
    },
    {
      station: { id: "KOTA", code: "KOTA", name: "Kota Junction", latitude: 25.179, longitude: 75.843 },
      scheduledArrival: new Date().toISOString().replace(/T.*/, "T01:45:00.000Z"),
      scheduledDeparture: new Date().toISOString().replace(/T.*/, "T01:50:00.000Z"),
      distanceFromOriginKm: 700,
      status: "upcoming",
    },
    {
      station: { id: "MTJ", code: "MTJ", name: "Mathura Junction", latitude: 27.492, longitude: 77.673 },
      scheduledArrival: new Date().toISOString().replace(/T.*/, "T04:10:00.000Z"),
      scheduledDeparture: new Date().toISOString().replace(/T.*/, "T04:12:00.000Z"),
      distanceFromOriginKm: 1086,
      status: "upcoming",
    },
    {
      station: { id: "NDLS", code: "NDLS", name: "New Delhi", latitude: 28.642, longitude: 77.220 },
      scheduledArrival: new Date().toISOString().replace(/T.*/, "T05:25:00.000Z"),
      distanceFromOriginKm: 1238,
      status: "upcoming",
    },
  ],
  geometry: {
    type: "LineString",
    coordinates: [
      [72.819, 18.969], // Mumbai Central
      [72.829, 19.5],
      [72.835, 20.0],
      [72.829, 21.195], // Surat
      [73.0, 21.8],
      [73.181, 22.307], // Vadodara
      [73.9, 22.7],
      [74.5, 23.0],
      [75.034, 23.333], // Ratlam
      [75.4, 23.8],
      [75.843, 25.179], // Kota
      [76.2, 25.8],
      [76.8, 26.5],
      [77.2, 27.0],
      [77.673, 27.492], // Mathura
      [77.4, 28.0],
      [77.220, 28.642], // New Delhi
    ],
  },
};

// ─── Mock Analytics ───────────────────────────────────────────────────────────

export const MOCK_ANALYTICS: TrainAnalytics = {
  progress: MOCK_LIVE_TRAIN_DATA.progress,
  stationsCompleted: 2,
  stationsTotal: 7,
  travelDurationMinutes: 267,
  estimatedArrivalMinutes: 480,
  highestElevationM: 623,
  currentElevationM: 134,
  delayHistory: [
    { stationName: "Mumbai Central", stationCode: "BCT", delayMinutes: 0, timestamp: "" },
    { stationName: "Surat", stationCode: "ST", delayMinutes: 8, timestamp: "" },
    { stationName: "Vadodara Junction", stationCode: "BRC", delayMinutes: 12, timestamp: "" },
  ],
};

// ─── Mock Nearby Features ─────────────────────────────────────────────────────

export const MOCK_NEARBY_FEATURES = [
  {
    id: "narmada",
    name: "Narmada River",
    type: "RIVER" as const,
    latitude: 22.3,
    longitude: 73.5,
    distanceFromTrainKm: 1.8,
    description: "One of India's major rivers flowing westward",
  },
  {
    id: "statue-unity",
    name: "Statue of Unity",
    type: "MONUMENT" as const,
    latitude: 21.838,
    longitude: 73.722,
    distanceFromTrainKm: 32.4,
    description: "World's tallest statue at 182 metres",
  },
  {
    id: "champaner",
    name: "Champaner-Pavagadh",
    type: "ATTRACTION" as const,
    latitude: 22.486,
    longitude: 73.531,
    distanceFromTrainKm: 45.1,
    description: "UNESCO World Heritage Site",
  },
];
