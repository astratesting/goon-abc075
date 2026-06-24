import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const orders = await prisma.order.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    pendingOrders: orders.filter((o) => o.status === "pending" || o.status === "submitted").length,
  };

  return NextResponse.json({
    orders,
    users,
    stats,
    totalUsers: users.length,
    recentSignups: users.map((u) => ({
      email: u.email,
      createdAt: u.createdAt.toISOString(),
      lastSignInAt: null,
    })),
  });
}
