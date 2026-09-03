import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/portal/login", request.url));
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 0, path: "/" };
  response.cookies.set("gsss_portal", "", options);
  response.cookies.set("gsss_access_token", "", options);
  return response;
}
