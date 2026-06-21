import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("admin123", 10);
  const demoPassword = await hash("demo123", 10);

  await prisma.user.upsert({
    where: { email: "admin@goon.app" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@goon.app",
      passwordHash: adminPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "demo@goon.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@goon.app",
      passwordHash: demoPassword,
      role: "user",
    },
  });

  const demoUser = await prisma.user.findUnique({ where: { email: "demo@goon.app" } });
  if (demoUser) {
    await prisma.order.createMany({
      data: [
        {
          orderNumber: "ORD-20260620-AB12",
          userId: demoUser.id,
          fileName: "bracket-v3.stl",
          material: "PLA+",
          quantity: 5,
          pricePerUnit: 12.5,
          totalPrice: 62.5,
          status: "printing",
          estimatedDelivery: new Date(Date.now() + 2 * 86400000),
        },
        {
          orderNumber: "ORD-20260618-CD34",
          userId: demoUser.id,
          fileName: "phone-case.3mf",
          material: "Resin",
          quantity: 1,
          pricePerUnit: 45.0,
          totalPrice: 50.0,
          status: "shipped",
          estimatedDelivery: new Date(Date.now() + 1 * 86400000),
        },
        {
          orderNumber: "ORD-20260615-EF56",
          userId: demoUser.id,
          fileName: "gear-assembly.obj",
          material: "Nylon",
          quantity: 10,
          pricePerUnit: 28.0,
          totalPrice: 280.0,
          status: "delivered",
        },
      ],
    });
  }

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
