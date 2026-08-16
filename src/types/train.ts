// ─── Train ────────────────────────────────────────────────────────────────────

export interface Station {
  id: string;
  code: string;
  name: string;
  latitude?: number;
  longitude?: number;
  state?: string;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  origin: Station;
  destination: Station;
  type?: string; // Rajdhani, Shatabdi, Express, etc.
}

export interface TrainLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  speed?: number; // km/h
  heading?: number; // degrees 0–360
}

export type TrainState =
  | "ON_TIME"
  | "DELAYED"
  | "EARLY"
  | "HALTED"
  | "COMPLETED"
  | "NOT_STARTED"
  | "UNKNOWN";

export interface TrainStatus {
  state: TrainState;
  delayMinutes: number;
  currentStation?: Station;
  nextStation?: Station;
  lastUpdated: string;
  dataSource?: "live" | "scheduled" | "cached";
}

export interface JourneyProgress {
  percentage: number;
  totalDistanceKm: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export interface StationSchedule {
  station: Station;
  scheduledArrival?: string;   // ISO timestamp
  scheduledDeparture?: string;
  actualArrival?: string;
  actualDeparture?: string;
  delayMinutes?: number;
  haltDurationMinutes?: number;
  distanceFromOriginKm?: number;
  status: "completed" | "current" | "upcoming" | "skipped";
  platform?: string;
}

export interface TrainRoute {
  trainNumber: string;
  stations: StationSchedule[];
  geometry?: GeoJSON.LineString; // Full route GeoJSON
  totalDistanceKm: number;
}

// ─── Live Status Response ─────────────────────────────────────────────────────

export interface LiveTrainData {
  train: Train;
  status: TrainStatus;
  location?: TrainLocation;
  progress: JourneyProgress;
  currentStation?: StationSchedule;
  nextStation?: StationSchedule;
  route?: TrainRoute;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DelayDataPoint {
  stationName: string;
  stationCode: string;
  delayMinutes: number;
  timestamp: string;
}

export interface TrainAnalytics {
  progress: JourneyProgress;
  delayHistory: DelayDataPoint[];
  stationsCompleted: number;
  stationsTotal: number;
  travelDurationMinutes: number;
  estimatedArrivalMinutes: number;
  highestElevationM?: number;
  currentElevationM?: number;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface TrainSearchResult {
  trainNumber: string;
  name: string;
  origin: Station;
  destination: Station;
  departureTime?: string; // HH:MM
  type?: string;
}

export interface RecentSearch {
  trainNumber: string;
  trainName: string;
  lastViewed: string; // ISO timestamp
}

// ─── Weather ──────────────────────────────────────────────────────────────────

export interface Weather {
  temperature: number;
  feelsLike?: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  rainProbability?: number;
  condition: string;
  conditionCode?: number; // OpenWeather condition code
  timestamp: string;
  location?: string;
}

// ─── Geography ────────────────────────────────────────────────────────────────

export type GeographicFeatureType =
  | "RIVER"
  | "LAKE"
  | "MOUNTAIN"
  | "BRIDGE"
  | "TUNNEL"
  | "MONUMENT"
  | "ATTRACTION"
  | "CITY"
  | "DISTRICT"
  | "GHAT"
  | "FOREST";

export interface GeographicFeature {
  id: string;
  name: string;
  type: GeographicFeatureType;
  latitude: number;
  longitude: number;
  distanceFromTrainKm: number;
  description?: string;
  wikidata?: string;
}

// ─── Elevation ────────────────────────────────────────────────────────────────

export interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
  latitude?: number;
  longitude?: number;
}

export interface ElevationProfile {
  points: ElevationPoint[];
  maxElevationM: number;
  minElevationM: number;
  totalAscentM: number;
  totalDescentM: number;
  currentPositionKm?: number;
  terrainCategory?: "COASTAL_PLAIN" | "DECCAN_PLATEAU" | "VINDHYA_RANGE" | "GHATS_PASS" | "GANGETIC_PLAIN" | "HILL_RAILWAY";
  highestPointLocation?: string;
  datasetSource?: string;
}
