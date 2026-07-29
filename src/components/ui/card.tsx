import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "white";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-kb-background",
      white: "bg-kb-white",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-kb-surface-secondary p-8 shadow-sm",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export { Card };
