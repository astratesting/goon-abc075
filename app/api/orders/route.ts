import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateOrderInput } from "@/lib/validation/orders";
import { computePriceCents, TECH_LEAD_DAYS } from "@/lib/pricing";
import { runRepair } from "@/lib/ai/repair";
import { trackServerEvent } from "@/lib/posthog/server";
import { advanceOrderStatus } from "@/lib/orders/progress";

function generateOrderNumber(seq: number): string {
  return `GO-${String(seq).padStart(6, "0")}`;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const cursor = url.searchParams.get("cursor");
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);

  const where: Record<string, unknown> = { userId: session.user.id };
  if (status === "active") {
    where.status = { in: ["queued", "printing", "quality_check"] };
  } else if (status) {
    where.status = status;
  }

  const query: Parameters<typeof prisma.order.findMany>[0] = {
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      orderNumber: true,
      fileName: true,
      material: true,
      tech: true,
      color: true,
      quantity: true,
      shippingZip: true,
      totalPrice: true,
      pricePerUnit: true,
      status: true,
      aiRepair: true,
      repaired: true,
      createdAt: true,
      estimatedDelivery: true,
    },
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  let orders = await prisma.order.findMany(query);

  // Advance statuses for active orders
  const now = Date.now();
  for (const order of orders) {
    if (["queued", "printing", "quality_check"].includes(order.status)) {
      const result = advanceOrderStatus({
        status: order.status,
        tech: order.tech,
        createdAt: order.createdAt,
        statusUpdatedAt: order.createdAt,
      });
      if (result.changed) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: result.newStatus, statusUpdatedAt: new Date() },
        });
        (order as Record<string, unknown>).status = result.newStatus;
        trackServerEvent("order_status_changed", session.user.id, {
          orderId: order.id,
          from: order.status,
          to: result.newStatus,
        });
      }
    }
  }

  const hasMore = orders.length === limit;

  return NextResponse.json({ orders, hasMore, nextCursor: hasMore ? orders[orders.length - 1]?.id : null });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = validateOrderInput(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const count = await prisma.order.count();
    const orderNumber = generateOrderNumber(count + 1);

    const leadDays = TECH_LEAD_DAYS[data.tech] || TECH_LEAD_DAYS.fdm;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + leadDays.max);

    let repaired = false;
    let repairedIssues = "";

    if (data.aiRepair && data.fileBase64) {
      try {
        const buffer = Buffer.from(data.fileBase64, "base64");
        const result = await runRepair(buffer as unknown as ArrayBuffer, data.fileSizeBytes);
        repaired = result.repaired;
        repairedIssues = result.issuesFixed.join(",");
      } catch {
        // Repair is best-effort
      }
    }

    const priceCents = computePriceCents({
      tech: data.tech,
      fileSizeBytes: data.fileSizeBytes,
      quantity: data.quantity,
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        fileName: data.fileName,
        material: data.material,
        tech: data.tech,
        color: data.color,
        shippingZip: data.shippingZip,
        quantity: data.quantity,
        aiRepair: data.aiRepair,
        repaired,
        repairedIssues,
        quoteCents: priceCents,
        pricePerUnit: priceCents / 100 / data.quantity,
        totalPrice: priceCents / 100,
        leadDaysMin: leadDays.min,
        leadDaysMax: leadDays.max,
        status: "queued",
        statusUpdatedAt: new Date(),
        estimatedDelivery,
        fileMeta: JSON.stringify({
          name: data.fileName,
          size_bytes: data.fileSizeBytes,
        }),
      },
    });

    // Track events
    trackServerEvent("order_created", session.user.id, {
      tech: data.tech,
      material: data.material,
      price_cents: priceCents,
      ai_repair: data.aiRepair,
      quantity: data.quantity,
    });

    if (data.aiRepair) {
      trackServerEvent("ai_repair_run", session.user.id, {
        file_hash: repairedIssues || "stub",
        size_bytes: data.fileSizeBytes,
        repaired,
      });
    }

    return NextResponse.json(order);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Order creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
