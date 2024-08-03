import { NextResponse } from "next/server";
import { getSession } from "./lib/Session";

const blacklistPathsUnauthenticated = [
  "/",
  "/email-verifizieren",
  "/einstellungen",
];
const blacklistPathsUnauthenticatedRegex = /^\/((?!profil|post).*)$/;
const blacklistPathsAuthenticated = [
  "/anmelden",
  "/registrieren",
  "/passwort-vergessen",
];

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Regex to skip API routes, static files, and other paths that should always be accessible
  const matchRegex =
    /^\/((?!api|_next|favicon.ico|fonts|images|impressum|datenschutz|passwort-reset).*)$/;
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
    if (
      blacklistPathsUnauthenticated.includes(pathname) ||
      !blacklistPathsUnauthenticatedRegex.test(pathname)
    ) {
      return NextResponse.redirect(new URL("/anmelden", request.url));
    }
  }

  return NextResponse.next();
}
