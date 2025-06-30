import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n";

export default createMiddleware(routing);

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files
     * - public routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api|unauthorized|images).*)",
    "/",
    "/vi",
    "/en",
  ],
};
