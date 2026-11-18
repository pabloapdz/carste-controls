import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200",
        neutral: "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-200",
        outline: "border border-neutral-200 text-neutral-600",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
        info: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
        warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
        danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
