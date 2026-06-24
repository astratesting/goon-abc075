import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createOrderSchema = z.object({
  fileName: z.string().min(1),
  material: z.string().min(1),
  fileMeta: z.string().optional(),
  quoteCents: z.number().int().nonnegative(),
  leadDaysMin: z.number().int().positive(),
  leadDaysMax: z.number().int().positive(),
  quantity: z.number().int().min(1).default(1),
  pricePerUnit: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
});

function generateOrderNumber(seq: number): string {
  return `GO-${String(seq).padStart(6, "0")}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      fileName: true,
      material: true,
      totalPrice: true,
      status: true,
      createdAt: true,
    },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createOrderSchema.parse(body);

    const count = await prisma.order.count();
    const orderNumber = generateOrderNumber(count + 1);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + data.leadDaysMax);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        fileName: data.fileName,
        material: data.material,
        fileMeta: data.fileMeta ?? "{}",
        quoteCents: data.quoteCents,
        leadDaysMin: data.leadDaysMin,
        leadDaysMax: data.leadDaysMax,
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        totalPrice: data.totalPrice,
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
