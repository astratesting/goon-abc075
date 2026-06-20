import { NextResponse } from "next/server";
import { createUser } from "@/lib/demo-store";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    const user = await createUser(email, password, name);
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
