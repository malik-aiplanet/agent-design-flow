import React, { useRef, useEffect, useState, useCallback } from "react";
import Markdown from "@/components/app/markdown";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

// Best practice: Standard textarea with live preview
export default function AccessibleMarkdownTextarea({
  value = "",
  onChange,
  onKeyDown,
  placeholder = "Ask me anything (supports Markdown)",
  className,
  livePreview = true,
}: MarkdownEditorProps & { livePreview?: boolean }) {
  const textareaRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState(value);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [localValue]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <textarea
          value={localValue}
          className="sr-only"
          aria-label={placeholder}
        />

        <Markdown>
          <div
            aria-placeholder={localValue.length == 0 ? placeholder : localValue}
            contentEditable
            ref={textareaRef}
            onKeyDown={onKeyDown}
            className="min-h-[40px] max-h-[200px] overflow-y-auto px-3 py-2 cursor-text focus-within:ring-0 focus-within:outline-0"
          ></div>
        </Markdown>
      </div>
    </div>
  );
}
