export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_PROTOCOL: process.env.NEXT_PUBLIC_API_PROTOCOL || "http",
  API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || "api",
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "1",
  API_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  API_URL_PUBLIC: process.env.NEXT_PUBLIC_API_BASE_URL_PUBLIC || "public",
  API_URL_SHARED: process.env.NEXT_PUBLIC_API_BASE_URL_SHARED || "shared",
  API_URL_ADMIN: process.env.NEXT_PUBLIC_API_BASE_URL_ADMIN || "admin",
  API_URL_SYSTEM: process.env.NEXT_PUBLIC_API_BASE_URL_SYSTEM || "system",
  API_URL_USER: process.env.NEXT_PUBLIC_API_BASE_URL_USER || "user",
  DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "vi",
};
