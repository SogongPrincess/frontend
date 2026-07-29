import type { HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
  label?: string;
}

function LoadingSpinner({
  size = "default",
  label = "로딩 중",
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      role="status"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}>
      <Loader2
        className={cn("animate-spin text-kb-yellow-positive", sizes[size])}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { LoadingSpinner };
