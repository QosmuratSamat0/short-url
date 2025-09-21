export interface UrlRequest {
  url: string;
  alias?: string;
}

export interface UrlResponse {
  status: string;
  alias?: string;
  error?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface ApiError {
  status: string;
  error: string;
}
