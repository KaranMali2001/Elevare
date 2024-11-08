import { NextRequest, NextResponse } from "next/server";

import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  //await withAuth;
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();

  return response;
}
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
