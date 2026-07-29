import type { ReactNode } from "react";
import { AssistantCharacter } from "@/components/assistant/AssistantCharacter";

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-kb-surface-secondary bg-kb-background/50 p-8 shadow-sm">
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>{children}</div>
        <div className="flex justify-center lg:justify-end">
          <AssistantCharacter />
        </div>
      </div>
    </div>
  );
}
