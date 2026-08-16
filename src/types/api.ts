// ─── API Response Contract ────────────────────────────────────────────────────

export type ApiErrorCode =
  | "INVALID_TRAIN"
  | "TRAIN_NOT_FOUND"
  | "STATUS_UNAVAILABLE"
  | "PROVIDER_TIMEOUT"
  | "RATE_LIMITED"
  | "MAP_DATA_UNAVAILABLE"
  | "WEATHER_UNAVAILABLE"
  | "GEOGRAPHY_UNAVAILABLE"
  | "ELEVATION_UNAVAILABLE"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  meta?: {
    cachedAt?: string;
    dataSource?: string;
    nextRefreshIn?: number; // seconds
  };
}

// Helper to create standard API errors
export function createApiError(
  code: ApiErrorCode,
  message: string,
  retryable: boolean,
  details?: Record<string, unknown>
): ApiError {
  return { code, message, retryable, details };
}

// Type guard
export function isApiError<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { error: ApiError } {
  return !!response.error;
}
