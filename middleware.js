import { NextResponse } from "next/server";
import { getSession } from "./lib/Session";

export const blacklistPathsUnauthenticated = ["/", "/email-verifizieren"];
export const blacklistPathsAuthenticated = ["/anmelden", "/registrieren"];

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const session = await getSession();

  if (session) {
    if (!session.user.emailVerified) {
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
