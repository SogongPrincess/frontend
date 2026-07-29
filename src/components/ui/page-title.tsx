import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
}

function PageTitle({
  title,
  description,
  action,
  className,
  ...props
}: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}>
      <div>
        <h1 className="text-3xl font-semibold text-kb-gray">{title}</h1>
        {description && (
          <p className="mt-3 text-kb-mid-tone">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export { PageTitle };
