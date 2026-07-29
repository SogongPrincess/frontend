import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SpeechBubbleProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "positive" | "negative";
}

function SpeechBubble({
  tone = "positive",
  className,
  children,
  ...props
}: SpeechBubbleProps) {
  const tones = {
    positive: "bg-kb-yellow-positive",
    negative: "bg-kb-yellow-negative",
  };

  return (
    <div
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium text-kb-gray",
        tones[tone],
        className,
      )}
      {...props}>
      {children}
    </div>
  );
}

export { SpeechBubble };
