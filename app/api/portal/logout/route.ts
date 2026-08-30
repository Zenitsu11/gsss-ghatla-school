import { NextResponse } from "next/server";
export async function GET(request:Request){const response=NextResponse.redirect(new URL("/portal/login",request.url));response.cookies.set("gsss_portal","",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",maxAge:0,path:"/"});return response;}
