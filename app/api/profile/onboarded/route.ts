import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trackServerEvent } from "@/lib/posthog/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let useCase: string | undefined;
  let homePrinter: string | undefined;
  let preferredMaterial: string | undefined;
  try {
    const body = await request.json();
    useCase = body.useCase;
    homePrinter = body.homePrinter;
    preferredMaterial = body.preferredMaterial;
  } catch {
    // Body is optional
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      onboarded: true,
      ...(useCase && { role: session.user.role || "user" }),
    },
  });

  trackServerEvent("onboarding_completed", session.user.id, {
    useCase,
    homePrinter,
    preferredMaterial,
  });

  return NextResponse.json({ ok: true });
}
