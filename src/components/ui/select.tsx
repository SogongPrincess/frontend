import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-10 w-full appearance-none rounded-md border border-kb-border-strong bg-kb-white px-3 py-2 pr-8 text-sm text-kb-gray transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kb-yellow-positive disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kb-mid-tone" />
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
