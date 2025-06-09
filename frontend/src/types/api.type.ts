export interface ApiResponseMetadata {
  language: string;
  timestamp: number;
  timezone: string;
  path: string;
  version: string;
}

export interface ApiResponse<T = undefined> {
  statusCode: number;
  message: string;
  _metadata?: ApiResponseMetadata;
  data?: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  _metadata?: ApiResponseMetadata;
  errors?: Record<string, string[] | string | any[]>;
}
