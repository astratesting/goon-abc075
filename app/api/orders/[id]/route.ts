import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { advanceOrderStatus } from "@/lib/orders/progress";
import { trackServerEvent } from "@/lib/posthog/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.user.id) {
    // Don't leak existence — return 404 for both missing and non-owned
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Advance status if active
  if (["queued", "printing", "quality_check"].includes(order.status)) {
    const result = advanceOrderStatus({
      status: order.status,
      tech: order.tech,
      createdAt: order.createdAt,
      statusUpdatedAt: order.statusUpdatedAt,
    });
    if (result.changed) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: result.newStatus, statusUpdatedAt: new Date() },
      });
      trackServerEvent("order_status_changed", session.user.id, {
        orderId: order.id,
        from: order.status,
        to: result.newStatus,
      });
      order.status = result.newStatus;
    }
  }

  return NextResponse.json(order);
}
