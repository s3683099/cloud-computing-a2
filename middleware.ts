import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  console.log(request.nextUrl.pathname);
  if (!cookies().has("session")) {
    return NextResponse.redirect(new URL("/logout", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logout|login).*)"],
};
