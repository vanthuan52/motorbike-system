import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constant/constant";
import { ApiErrorResponse } from "@/types/api.type";
import {
  AuthRefreshTokenResponse,
  AuthRefreshTokenResponseData,
} from "@/features/auth/types";
import { APP_CONFIG } from "@/config";
import { formatToApiUrl } from "@/utils/format-to-api-url";
import { API_ENDPOINTS } from "@/constant/api-endpoint";

/**
 * API route: /api/auth/refresh-token
 *
 * Acts as a proxy to the backend login endpoint
 * Handles:
 * - Request refresh token
 * - Receiving accessToken and refreshToken
 * - Setting secure HTTP-only cookies
 *
 * This approach ensures:
 * - Token security
 * - Consistent session management with NextJS middleware
 * @param req
 * @returns
 */
export async function POST() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get(REFRESH_TOKEN_KEY)?.value;

  const url = formatToApiUrl(
    APP_CONFIG.API_URL,
    APP_CONFIG.API_PREFIX,
    APP_CONFIG.API_VERSION,
    APP_CONFIG.API_URL_SHARED
  );

  if (!refreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: "No refresh token",
      } as ApiErrorResponse,
      { status: 401 }
    );
  }

  const response = await fetch(
    `${url}/${API_ENDPOINTS.SHARED.AUTH_REFRESH_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
  const data: AuthRefreshTokenResponse = await response.json();
  const responseData: AuthRefreshTokenResponseData | undefined = data.data;

  if (!response.ok || !responseData) {
    return NextResponse.json(
      {
        success: false,
        statusCode: data.statusCode,
        message: data.message,
        _metadata: data._metadata,
        data: responseData,
        error: data.message,
      },
      { status: response.status }
    );
  }

  (await cookieStore).set(ACCESS_TOKEN_KEY, responseData.accessToken, {
    httpOnly: true,
    secure: APP_CONFIG.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  (await cookieStore).set(REFRESH_TOKEN_KEY, responseData.refreshToken, {
    httpOnly: true,
    secure: APP_CONFIG.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    _metadata: data._metadata,
    data: responseData,
  });
}
