import { cn } from "@/lib/utils";
import ChatArea from "./chat-area";
import ChatPrompt from "./chat-prompt";
import { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useAppStore } from "@/lib/app-store";

export default function ChatInterface({ app }: { app: AppData }) {
  const store = useAppStore();

  return (
    <div className={cn("min-h-full flex", "px-[22%]")}>
      {/* Chat area - conditionally centered or normal */}
      <div
        className={cn(
          "flex flex-col justify-between flex-1",
          store.messages.length === 0 ? "" : "py-4"
        )}
      >
        <ChatArea
          title={app.name}
          description={app.description}
          messages={store.messages}
        />
        {/* Prompt centered when no messages */}
        <div
          className={cn(
            store.messages.length === 0
              ? "w-full mb-12"
              : "sticky bottom-0 pb-4 bg-neutral-100"
          )}
        >
          <ChatPrompt />
        </div>
      </div>
    </div>
  );
}
