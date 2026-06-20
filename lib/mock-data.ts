export interface Order {
  id: string;
  fileName: string;
  material: string;
  quantity: number;
  status: "ai-repair" | "printing" | "quality-check" | "shipped" | "delivered";
  price: number;
  createdAt: string;
  estimatedDelivery: string;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    fileName: "enclosure_v3.step",
    material: "PLA+ (White)",
    quantity: 2,
    status: "shipped",
    price: 34.0,
    createdAt: "2026-06-18",
    estimatedDelivery: "2026-06-20",
  },
  {
    id: "ORD-2024-002",
    fileName: "gear-assembly.step",
    material: "PETG (Black)",
    quantity: 5,
    status: "printing",
    price: 72.5,
    createdAt: "2026-06-19",
    estimatedDelivery: "2026-06-21",
  },
  {
    id: "ORD-2024-003",
    fileName: "mount-bracket.stl",
    material: "Nylon (Gray)",
    quantity: 1,
    status: "ai-repair",
    price: 45.0,
    createdAt: "2026-06-20",
    estimatedDelivery: "2026-06-22",
  },
  {
    id: "ORD-2024-004",
    fileName: "prototype-shell.step",
    material: "Resin (Clear)",
    quantity: 3,
    status: "delivered",
    price: 58.0,
    createdAt: "2026-06-15",
    estimatedDelivery: "2026-06-17",
  },
];

export const statusLabels: Record<Order["status"], string> = {
  "ai-repair": "AI File Repair",
  printing: "Printing",
  "quality-check": "Quality Check",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const statusColors: Record<Order["status"], string> = {
  "ai-repair": "bg-purple-100 text-purple-700",
  printing: "bg-blue-100 text-blue-700",
  "quality-check": "bg-amber-100 text-amber-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-green-100 text-green-700",
};
