"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_TRANSITIONS: Record<string, string[]> = {
  submitted: ["in_review", "cancelled"],
  in_review: ["printing"],
  printing: ["shipped"],
  shipped: ["delivered"],
};

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Not found");
  if (order.userId !== session.user.id && session.user.role !== "admin") {
    throw new Error("Forbidden");
  }

  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid transition: ${order.status} → ${newStatus}`);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus, updatedAt: new Date() },
  });
}
