import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  // console.log(request.nextUrl.pathname);
  if (!cookies().has("session") || request.nextUrl.pathname == "/logout") {
    const response = NextResponse.next();
    response.cookies.delete("session");
    response.cookies.delete("image");

    return response;
  }
}

export const config = {
  matcher: ["/forum", "/forum/(.*)", "/admin", "/admin/(.*)", "/logout"],
};
