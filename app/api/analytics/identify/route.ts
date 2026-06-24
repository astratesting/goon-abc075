import { NextResponse } from "next/server";
import { aliasServer } from "@/lib/posthog/server";

export async function POST(request: Request) {
  try {
    const { distinctId, email } = await request.json();
    if (!distinctId || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    aliasServer(distinctId, email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
