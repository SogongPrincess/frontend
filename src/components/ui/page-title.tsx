import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
}

function PageTitle({
  title,
  description,
  action,
  className,
  titleClassName,
  descriptionClassName,
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
        <h1
          className={cn("text-xl font-semibold text-kb-gray", titleClassName)}>
          {title}
        </h1>
        {description && (
          <p className={cn("mt-3 text-kb-mid-tone", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export { PageTitle };
