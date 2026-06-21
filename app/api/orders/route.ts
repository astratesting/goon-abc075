import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createOrderSchema = z.object({
  fileId: z.string().optional(),
  fileName: z.string().min(1),
  material: z.string().min(1),
  quantity: z.number().int().min(1),
  pricePerUnit: z.number().positive(),
  totalPrice: z.number().positive(),
  notes: z.string().optional(),
  shippingAddress: z.string().optional(),
});

function generateOrderNumber(): string {
  const date = new Date();
  const prefix = "ORD";
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${datePart}-${rand}`;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createOrderSchema.parse(body);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        ...data,
        estimatedDelivery,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : "Order creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
