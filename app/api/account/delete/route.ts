import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body.confirm !== "DELETE") {
      return NextResponse.json({ error: "Please confirm by typing DELETE" }, { status: 400 });
    }

    const userId = session.user.id;

    // Delete orders, files, sessions, accounts, then user
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.uploadedFile.deleteMany({ where: { userId } });
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Account deletion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
