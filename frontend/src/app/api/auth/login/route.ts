import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import {
  AuthLoginResponse,
  AuthLoginResponseData,
  LoginCredentials,
} from "@/features/auth/types";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constant/constant";
import { APP_CONFIG } from "@/config";
import { formatToApiUrl } from "@/utils/format-to-api-url";

/**
 * API route: /api/auth/login
 *
 * Acts as a proxy to the backend login endpoint
 * Handles:
 * - Forwarding login credentials
 * - Receiving accessToken and refreshToken
 * - Setting secure HTTP-only cookies
 *
 * This approach ensures:
 * - Token security
 * - Consistent session management with NextJS middleware
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const { email, password }: LoginCredentials = await req.json();

  const url = formatToApiUrl(
    APP_CONFIG.API_URL,
    APP_CONFIG.API_PREFIX,
    APP_CONFIG.API_VERSION,
    APP_CONFIG.API_URL_PUBLIC
  );

  const response = await fetch(
    `${url}/${API_ENDPOINTS.PUBLIC.AUTH_LOGIN_CREDENTIAL}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  const data: AuthLoginResponse = await response.json();
  const responseData: AuthLoginResponseData | undefined = data.data;

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

  const cookieStore = cookies();

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
