import React from "react";
import { FileTextIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Star from "@/components/icons/star";
import PDF from "@/components/icons/pdf";
import Retry from "@/components/icons/retry";
import Markdown from "@/components/app/markdown";
import CopyButton from "@/components/app/copy-button";

const getFileIcon = (type: string) => {
  if (type.startsWith("image")) return <ImageIcon />;
  if (type.includes("pdf")) return <PDF />;
  return <FileTextIcon />;
};

export default function MessageBubble({
  content,
  role,
  file,
}: Omit<Message, "id">) {
  const isUser = role === "user";

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const icon = getFileIcon(file?.mimetype || "");

  return (
    <div
      className={cn(
        "md:max-w-[70%] px-4 py-2 rounded-[16px] flex flex-col gap-2",
        isUser ? "lg:self-end" : "lg:self-start"
      )}
    >
      {typeof file !== "undefined" && (
        <div
          className={cn(
            "flex items-center self-end justify-start gap-4 bg-white rounded-2xl shadow-sm",
            "min-w-xs p-4 pr-8"
          )}
        >
          <div className="p-2">{icon}</div>
          <div className="flex flex-col gap-2">
            <span className="text-sm leading-4.5 font-semibold truncate flex-1">
              {file.name}
            </span>
            <span className="text-xs leading-4 text-current/40">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>
      )}
      <div
        className={cn(
          "p-6 rounded-2xl flex gap-2 shadow-md",
          isUser ? "bg-blue-600 text-white" : "bg-white"
        )}
      >
        <div>
          {!isUser && (
            <div className="bg-teal-800 text-white p-2 rounded-full">
              <Star className="h-4 w-4 fill-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 min-w-md">
          {isUser ? (
            <Markdown>{content}</Markdown>
          ) : (
            <>
              <h4 className="text-sm font-semibold">AI Agent</h4>
              <Markdown>{content}</Markdown>
              <div className="flex text-current/60 -ml-3 gap-1">
                <Button variant={"ghost"} className="cursor-pointer -mr-1">
                  <Retry className="h-3.5 w-3.5" />
                </Button>
                <CopyButton data={content} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
