import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation/auth";
import { trackServerEvent, aliasServer } from "@/lib/posthog/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists. Sign in instead." },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: normalizedEmail.split("@")[0],
        onboarded: false,
      },
    });

    // Fire PostHog signup event
    trackServerEvent("signup_completed", user.id, { email: normalizedEmail });

    // Alias anonymous events to this user
    const anonymousId = body.anonymousId;
    if (anonymousId && anonymousId !== user.id) {
      aliasServer(anonymousId, user.id);
    }

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
