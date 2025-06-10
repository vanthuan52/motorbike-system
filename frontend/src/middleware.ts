import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { ROUTER_PATH } from "./constant/router-path";
import { ACCESS_TOKEN_KEY } from "./constant/constant";
import { AuthJwtAccessTokenPayload } from "./features/auth/types";
import { isTokenExpired } from "./utils/jwt.utils";
import { ENUM_POLICY_ROLE_TYPE } from "./features/role/types";

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

const AUTH_COOKIE_KEY = ACCESS_TOKEN_KEY;

// fuction to determine if the route requires authentication
function isProtectedRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(AUTH_COOKIE_KEY)?.value;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname) && !accessToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ROUTER_PATH.LOGIN;
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken) {
    if (pathname === ROUTER_PATH.LOGIN || pathname === ROUTER_PATH.REGISTER) {
      return NextResponse.redirect(new URL(ROUTER_PATH.HOME, request.url));
    }

    try {
      const decoded = jwtDecode<AuthJwtAccessTokenPayload>(accessToken);

      if (isTokenExpired(decoded.exp)) {
        console.log("is token expired");
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = ROUTER_PATH.LOGIN;
        loginUrl.searchParams.set("expired", "1");
        return NextResponse.redirect(loginUrl);
      }

      if (
        isAdminRoute(pathname) &&
        decoded.role !== ENUM_POLICY_ROLE_TYPE.ADMIN
      ) {
        const unauthorizedUrl = request.nextUrl.clone();
        unauthorizedUrl.pathname = ROUTER_PATH.UNAUTHORIZIED;
        return NextResponse.redirect(unauthorizedUrl);
      }
    } catch (err: any) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = ROUTER_PATH.LOGIN;
      loginUrl.searchParams.set("invalid", "1");
      return NextResponse.redirect(loginUrl);
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
