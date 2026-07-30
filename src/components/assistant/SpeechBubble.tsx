import type { HTMLAttributes, KeyboardEvent, MouseEvent } from "react";
import { cn } from "@/lib/utils";

export interface SpeechBubbleProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "positive" | "negative";
}

function SpeechBubble({
  tone = "positive",
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: SpeechBubbleProps) {
  const tones = {
    positive: "bg-kb-yellow-positive",
    negative: "bg-kb-yellow-negative",
  };

  const isInteractive = Boolean(onClick);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (isInteractive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium text-kb-gray transition-transform duration-200 ease-out hover:scale-110 hover:shadow-lg",
        isInteractive && "cursor-pointer",
        tones[tone],
        className,
      )}
      {...props}>
      {children}
    </div>
  );
}

export { SpeechBubble };
