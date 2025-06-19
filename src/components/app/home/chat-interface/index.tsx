import { cn } from "@/lib/utils";
import ChatArea from "./chat-area";
import ChatPrompt from "./chat-prompt";
import { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useAppStore } from "@/lib/app-store";

export default function ChatInterface({ app }: { app: AppData }) {
  const store = useAppStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const { getSocket } = useSocket();

  // handle the incoming message
  useEffect(() => {
    if (store.task.length == 0) return;

    const socket = getSocket(store.runId);
    // set the message handler
    socket.addEventListener("message", (event) => {
      console.log(JSON.parse(event.data));
    });
  }, [store.task]);

  return (
    <div className={cn("min-h-full flex", "px-[22%]")}>
      {/* Chat area - conditionally centered or normal */}
      <div
        className={cn(
          "flex flex-col justify-between flex-1",
          messages.length === 0 ? "" : "py-4"
        )}
      >
        <ChatArea
          title={app.name}
          description={app.description}
          messages={messages}
        />
        {/* Prompt centered when no messages */}
        <div
          className={cn(
            messages.length === 0
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
