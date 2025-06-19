import { useEffect, useRef, useState } from "react";
import { MoveUp, Plus, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GoogleDrive from "@/components/icons/gdrive";
import axios from "axios";
import { get_client_env } from "@/lib/env";
import { useAppStore } from "@/lib/app-store";
import team_config from "public/team_config.json";
import { useSocket } from "@/contexts/SocketContext";

export default function ChatPrompt() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasContent, setHasContent] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const store = useAppStore();
  const { getSocket, isConnected, sendMessage } = useSocket();

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // adjust to content height
    }
    setHasContent(e.currentTarget.value.length != 0);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textareaRef.current) return;
    setIsDisabled(true);

    const message = textareaRef.current.value.trim();
    if (!message) return; // don't submit empty

    const formData = new FormData(e.currentTarget);
    // const env = get_client_env();

    // create a run
    // const token_type = localStorage.getItem("token_type");
    // const token = localStorage.getItem("access_token");

    // const bearer_token = `${token_type} ${token}`;
    // const response = await axios.post<RunData>(
    //   `${env.backend_url}/private/runs`,
    //   {
    //     task: {
    //       task: formData.get("input"),
    //     },
    //     team_config: team_config,
    //     session_id: store.selectedApp?.id,
    //   },
    //   {
    //     headers: {
    //       Authorization: bearer_token,
    //     },
    //   }
    // );

    // store.setRunId(response.data.id);
    store.setTask(formData.get("input") as string);

    textareaRef.current.value = "";
    textareaRef.current.style.height = "auto";

    setHasContent(false);
  };

  const onKeyDown: React.DOMAttributes<HTMLTextAreaElement>["onKeyDown"] = (
    event
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const form = event.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  useEffect(() => {
    if (!isConnected) return;

    // start stream
    sendMessage(
      JSON.stringify({
        type: "start_task",
        task: textareaRef.current?.value || "",
        team_config: team_config,
        session_id: store.selectedApp?.id,
      })
    );
  }, [isConnected]);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white w-full shadow-lg p-4 rounded-3xl flex flex-col gap-3"
    >
      {/* Textarea */}
      <Textarea
        autoFocus
        onKeyDown={onKeyDown}
        ref={textareaRef}
        onChange={handleInput}
        className={cn(
          "border-0 ring-0 outline-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-0 focus-within:border-0 focus-within:ring-0 focus-within:outline-0 shadow-none",
          "resize-none rounded-sm min-h-[40px] max-h-[200px] "
          // !hasContent ? "scrollbar-hidden" : "overflow-y-auto"
        )}
        name="input"
        placeholder="Ask me anything"
      />

      {/* Buttons */}
      <div className="flex justify-between px-2">
        <Popover>
          <PopoverTrigger
            className={cn(
              "w-8 h-8 border flex justify-center items-center cursor-pointer rounded-full"
            )}
          >
            <Plus />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-1 max-w-fit rounded-2xl">
            <Button
              type="button"
              variant={"ghost"}
              className="cursor-pointer flex justify-start gap-2 items-center"
            >
              <Upload className="h-5 w-5" />
              <span>Upload from computer</span>
            </Button>
            <Button
              type="button"
              variant={"ghost"}
              className="cursor-pointer flex justify-start gap-2 items-center"
            >
              <GoogleDrive className="h-5 w-5" />
              <span>Add from Google Drive</span>
            </Button>
          </PopoverContent>
        </Popover>
        <Button
          disabled={isDisabled || !hasContent}
          type="submit"
          variant={"ghost"}
          className={cn(
            "rounded-full bg-teal-800 hover:bg-teal-800/80 hover:text-white text-white",
            "cursor-pointer w-8 h-8"
          )}
        >
          <MoveUp />
        </Button>
      </div>
    </form>
  );
}
