import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/dashboard";

  // With NextAuth credentials, just check session and redirect
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/login", url.origin));
}
