type BadgeVariant = "success" | "draft" | "info" | "warning" | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-mint-brand/20 text-emerald-700",
  draft: "bg-sand-brand/20 text-amber-700",
  info: "bg-sky-brand/20 text-sky-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

export function Badge({ variant = "info", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    submitted: { variant: "info", label: "Submitted" },
    in_review: { variant: "draft", label: "In review" },
    printing: { variant: "warning", label: "Printing" },
    shipped: { variant: "success", label: "Shipped" },
    delivered: { variant: "success", label: "Delivered" },
    cancelled: { variant: "error", label: "Cancelled" },
    pending: { variant: "draft", label: "Pending" },
    processing: { variant: "info", label: "Processing" },
    "quality-check": { variant: "warning", label: "Quality Check" },
  };
  const entry = map[status] ?? { variant: "info" as BadgeVariant, label: status };
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
