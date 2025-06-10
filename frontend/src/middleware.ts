import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { ROUTER_PATH } from "./constant/router-path";
import { ACCESS_TOKEN_KEY } from "./constant/constant";
import { isTokenExpired } from "./utils/jwt.utils";
import { AuthJwtAccessTokenPayload } from "./features/auth/types";

const AUTH_ROUTES = [ROUTER_PATH.ACCOUNT];

const PUBLIC_ROUTES = [
  ROUTER_PATH.HOME,
  ROUTER_PATH.ABOUT,
  ROUTER_PATH.BLOG,
  ROUTER_PATH.SERVICES,
  ROUTER_PATH.CATEGORY,
  ROUTER_PATH.CONTACT,
  ROUTER_PATH.POLICY,
  ROUTER_PATH.MAINTAIN_REGISTRATION,
  ROUTER_PATH.CART,
  ROUTER_PATH.CHECKOUT,
  ROUTER_PATH.LOGIN,
  ROUTER_PATH.REGISTER,
  ROUTER_PATH.UNAUTHORIZIED,
];

const ADMIN_ONLY_ROUTES = ["/admin"];

function isProtectedRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  if (isProtectedRoute(pathname)) {
    if (!accessToken) {
      console.log("Token not found");
      const url = request.nextUrl.clone();
      url.pathname = ROUTER_PATH.LOGIN;
      return NextResponse.redirect(url);
    }

    const decoded: AuthJwtAccessTokenPayload = jwtDecode(accessToken);
    if (isTokenExpired(decoded.exp)) {
      console.log("Token is expired");
      const url = request.nextUrl.clone();
      url.pathname = ROUTER_PATH.LOGIN;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files
     * - public routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api|unauthorized).*)",
  ],
};
