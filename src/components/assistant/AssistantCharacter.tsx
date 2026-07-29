import type { HTMLAttributes } from "react";
import agurImage from "@/assets/agur.webp";
import { cn } from "@/lib/utils";

export interface AssistantCharacterProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

function AssistantCharacter({
  size = "default",
  className,
  ...props
}: AssistantCharacterProps) {
  const sizes = {
    sm: "max-w-[10rem]",
    default: "max-w-sm",
    lg: "max-w-md",
  };

  return (
    <div
      className={cn(
        "w-full rounded-[2rem] border border-kb-surface-secondary bg-kb-white/80 p-6 shadow-2xl",
        sizes[size],
        className,
      )}
      {...props}>
      <img
        src={agurImage}
        alt="AI 어시스턴트 캐릭터"
        className="w-full rounded-[1.25rem] object-contain"
      />
    </div>
  );
}

export { AssistantCharacter };
