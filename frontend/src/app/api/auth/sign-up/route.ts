import { APP_CONFIG } from "@/config";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import {
  AuthRegisterResponse,
  AuthRegisterResponseData,
  RegisterCredentials,
} from "@/features/auth/types";
import { formatToApiUrl } from "@/utils/format-to-api-url";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route: /api/auth/register
 *
 * Acts as a proxy to the backend sign up endpoint
 * Handles:
 * - Forwarding registration credentials
 * - Receiving response from the backend
 *
 * @param req - The request object containing registration credentials
 * @returns The response object containing the server's response
 */
export async function POST(req: NextRequest) {
  const { email, password, name, phone }: RegisterCredentials =
    await req.json();

  const url = formatToApiUrl(
    APP_CONFIG.API_URL,
    APP_CONFIG.API_PREFIX,
    APP_CONFIG.API_VERSION,
    APP_CONFIG.API_URL_PUBLIC
  );

  try {
    const response = await fetch(
      `${url}/${API_ENDPOINTS.PUBLIC.AUTH_SIGN_UP}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone }),
      }
    );
    const data: AuthRegisterResponse = await response.json();
    const responseData: AuthRegisterResponseData | undefined = data.data;

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
    return NextResponse.json({
      success: true,
      statusCode: data.statusCode,
      message: data.message,
      _metadata: data._metadata,
      data: responseData,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 503,
        message: "Service unavailable. Please try again later.",
        error: error.message,
      },
      { status: 503 }
    );
  }
}
