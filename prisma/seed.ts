import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminHash = await hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@goon.app" },
    update: {},
    create: {
      email: "admin@goon.app",
      name: "Admin User",
      passwordHash: adminHash,
      role: "admin",
      onboarded: true,
    },
  });

  // Create demo user
  const demoHash = await hash("demo123", 10);
  const demo = await prisma.user.upsert({
    where: { email: "demo@goon.app" },
    update: {},
    create: {
      email: "demo@goon.app",
      name: "Demo User",
      passwordHash: demoHash,
      role: "user",
      onboarded: true,
    },
  });

  // Create demo orders for the demo user
  const orders = [
    {
      orderNumber: "GO-000001",
      userId: demo.id,
      fileName: "bracket-v3.stl",
      material: "fdm_pla",
      fileMeta: JSON.stringify({ name: "bracket-v3.stl", size_bytes: 2457600, ext: "stl" }),
      quoteCents: 1623,
      leadDaysMin: 3,
      leadDaysMax: 5,
      quantity: 5,
      pricePerUnit: 16.23,
      totalPrice: 16.23,
      status: "printing",
    },
    {
      orderNumber: "GO-000002",
      userId: demo.id,
      fileName: "phone-case.obj",
      material: "sla_resin",
      fileMeta: JSON.stringify({ name: "phone-case.obj", size_bytes: 5242880, ext: "obj" }),
      quoteCents: 4629,
      leadDaysMin: 4,
      leadDaysMax: 6,
      quantity: 1,
      pricePerUnit: 46.29,
      totalPrice: 46.29,
      status: "shipped",
    },
    {
      orderNumber: "GO-000003",
      userId: demo.id,
      fileName: "gear-assembly.stl",
      material: "sls_nylon",
      fileMeta: JSON.stringify({ name: "gear-assembly.stl", size_bytes: 8388608, ext: "stl" }),
      quoteCents: 6511,
      leadDaysMin: 5,
      leadDaysMax: 8,
      quantity: 10,
      pricePerUnit: 65.11,
      totalPrice: 65.11,
      status: "submitted",
    },
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {},
      create: {
        ...order,
        estimatedDelivery: new Date(Date.now() + order.leadDaysMax * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Create a second user for RLS testing
  const user2Hash = await hash("user2pass", 10);
  await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      email: "user2@example.com",
      name: "Second User",
      passwordHash: user2Hash,
      role: "user",
      onboarded: false,
    },
  });

  console.log("Seed complete:", { admin: admin.email, demo: demo.email, orders: orders.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
