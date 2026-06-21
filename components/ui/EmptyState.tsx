import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  cta?: ReactNode;
}

export function EmptyState({ icon: Icon, title, body, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">{body}</p>
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  );
}
