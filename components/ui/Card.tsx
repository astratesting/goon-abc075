import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = "", padding = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(26,35,48,0.04)] ${
        padding ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
