import { NextResponse } from "next/server";
import { getSession } from "./lib/Session";

// Define paths for redirection logic
export const blacklistPathsUnauthenticated = [
  "/",
  "/email-verifizieren",
  "/einstellungen",
];
export const blacklistPathsAuthenticated = ["/anmelden", "/registrieren"];

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Regex to skip API routes, static files, and other paths
  const matchRegex =
    /^\/((?!api|_next|favicon.ico|fonts|images|impressum|datenschutz|passwort-).*)$/;
  if (!matchRegex.test(pathname)) {
    return NextResponse.next();
  }

  const session = await getSession();

  if (session) {
    if (
      !session.user.emailVerified &&
      pathname !== "/email-verifizieren" &&
      pathname !== "/einstellungen"
    ) {
      return NextResponse.redirect(new URL("/email-verifizieren", request.url));
    }

    if (blacklistPathsAuthenticated.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (blacklistPathsUnauthenticated.includes(pathname)) {
      return NextResponse.redirect(new URL("/anmelden", request.url));
    }
  }

  return NextResponse.next();
}
