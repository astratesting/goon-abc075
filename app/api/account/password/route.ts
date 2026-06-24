import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { changePasswordSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const newHash = await hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newHash, tokenVersion: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Password change failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
