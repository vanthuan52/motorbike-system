import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = {
  client: createEnv({
    client: {
      NEXT_PUBLIC_NODE_ENV: z.string().min(1),
      NEXT_PUBLIC_BASE_URL: z.string().min(1).includes("http").nullish(),
      NEXT_PUBLIC_API_PROTOCOL: z.string().nullish(),
      NEXT_PUBLIC_API_PREFIX: z.string().nullish(),
      NEXT_PUBLIC_API_VERSION: z.string().nullish(),
      NEXT_PUBLIC_API_URL: z.string().nullish(),
      NEXT_PUBLIC_API_URL_PUBLIC: z.string().nullish(),
      NEXT_PUBLIC_API_URL_SHARED: z.string().nullish(),
      NEXT_PUBLIC_API_URL_ADMIN: z.string().nullish(),
      NEXT_PUBLIC_API_URL_SYSTEM: z.string().nullish(),
      NEXT_PUBLIC_API_URL_USER: z.string().nullish(),
      NEXT_PUBLIC_DEFAULT_LOCALE: z.string().nullish(),
      NEXT_PUBLIC_ACCESS_TOKEN_EXPIRED: z.string().nullish(),
      NEXT_PUBLIC_REFRESH_TOKEN_EXPIRED: z.string().nullish(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV || "development",
      NEXT_PUBLIC_BASE_URL:
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      NEXT_PUBLIC_API_PROTOCOL: process.env.NEXT_PUBLIC_API_PROTOCOL || "http",
      NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || "api",
      NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "1",
      NEXT_PUBLIC_API_URL:
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
      NEXT_PUBLIC_API_URL_PUBLIC:
        process.env.NEXT_PUBLIC_API_BASE_URL_PUBLIC || "public",
      NEXT_PUBLIC_API_URL_SHARED:
        process.env.NEXT_PUBLIC_API_BASE_URL_SHARED || "shared",
      NEXT_PUBLIC_API_URL_ADMIN:
        process.env.NEXT_PUBLIC_API_BASE_URL_ADMIN || "admin",
      NEXT_PUBLIC_API_URL_SYSTEM:
        process.env.NEXT_PUBLIC_API_BASE_URL_SYSTEM || "system",
      NEXT_PUBLIC_API_URL_USER:
        process.env.NEXT_PUBLIC_API_BASE_URL_USER || "user",
      NEXT_PUBLIC_DEFAULT_LOCALE:
        process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "vi",
      NEXT_PUBLIC_ACCESS_TOKEN_EXPIRED:
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRED || "3m",
      NEXT_PUBLIC_REFRESH_TOKEN_EXPIRED:
        process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRED || "7d",
    },
  }),

  server: createEnv({
    server: {},
    experimental__runtimeEnv: process.env,
  }),
};

export { env };
