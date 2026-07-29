import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { AssistantCharacter } from "@/components/assistant/AssistantCharacter";
import { SpeechBubble } from "@/components/assistant/SpeechBubble";

export interface AssistantMessage {
  text: string;
  tone?: "positive" | "negative";
}

export interface AssistantAreaProps extends HTMLAttributes<HTMLDivElement> {
  messages?: AssistantMessage[];
  characterSize?: "sm" | "default" | "lg";
}

function AssistantArea({
  messages = [],
  characterSize = "default",
  className,
  ...props
}: AssistantAreaProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-8",
        className,
      )}
      {...props}>
      {messages.length > 0 && (
        <div className="flex flex-col gap-3 text-center">
          {messages.map((message, index) => (
            <SpeechBubble key={index} tone={message.tone}>
              "{message.text}"
            </SpeechBubble>
          ))}
        </div>
      )}
      <AssistantCharacter size={characterSize} />
    </div>
  );
}

export { AssistantArea };
