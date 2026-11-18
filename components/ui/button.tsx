import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:scale-[0.98]",
        secondary:
          "bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200 hover:bg-brand-100 active:scale-[0.98]",
        outline:
          "border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.98]",
        ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        link: "text-brand-700 underline-offset-4 hover:underline",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
