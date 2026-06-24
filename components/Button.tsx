"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { OrbitSpinner } from "./Orbit";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-sky-brand text-white hover:shadow-lg hover:shadow-sky-brand/20 disabled:hover:shadow-none",
  secondary:
    "border-2 border-sky-brand text-sky-brand bg-white hover:bg-sky-brand hover:text-white",
  ghost: "text-gray-600 hover:bg-gray-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, children, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {loading && <OrbitSpinner size={14} className={variant === "primary" ? "text-white" : "text-sky-brand"} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
