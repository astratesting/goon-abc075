export type OrderStatus =
  | "queued"
  | "printing"
  | "quality_check"
  | "shipped"
  | "cancelled"
  | "submitted"
  | "in_review"
  | "delivered";

export const STATUS_LABELS: Record<string, string> = {
  queued: "Queued",
  printing: "Printing",
  quality_check: "Quality check",
  shipped: "Shipped",
  cancelled: "Cancelled",
  submitted: "Submitted",
  in_review: "In review",
  delivered: "Delivered",
};

export const TIMELINE_STATUSES: OrderStatus[] = [
  "queued",
  "printing",
  "quality_check",
  "shipped",
];

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function getStatusColor(status: string): "mint" | "sand" | "sky" | "gray" {
  switch (status) {
    case "shipped":
    case "delivered":
      return "mint";
    case "printing":
    case "queued":
      return "sand";
    case "submitted":
    case "in_review":
      return "sky";
    default:
      return "gray";
  }
}
