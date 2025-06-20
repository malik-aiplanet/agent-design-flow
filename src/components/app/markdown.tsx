import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  children: string;
  variant?: "default" | "inverted";
  className?: string;
}

export default function Markdown({
  children,
  variant = "default",
  className,
}: MarkdownProps) {
  const isInverted = variant === "inverted";

  return (
    <div
      className={cn(
        "prose max-w-none",
        isInverted ? "prose-invert" : "prose-gray",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Paragraphs
          p: ({ children }) => (
            <p
              className={cn(
                "mb-3 last:mb-0",
                isInverted ? "" : "text-gray-700"
              )}
            >
              {children}
            </p>
          ),

          // Headers
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0">
              {children}
            </h3>
          ),

          // Lists
          ul: ({ children }) => (
            <ul
              className={cn(
                "list-disc list-inside mb-3",
                isInverted ? "" : "ml-4"
              )}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className={cn(
                "list-decimal list-inside mb-3",
                isInverted ? "" : "ml-4"
              )}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,

          // Code
          code: ({ children }) => (
            <code
              className={cn(
                "block p-3 rounded text-sm font-mono overflow-x-auto",
                isInverted ? "bg-white/20" : "bg-gray-100"
              )}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => <pre className="mb-3">{children}</pre>,

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote
              className={cn(
                "border-l-4 pl-4 italic my-3",
                isInverted ? "border-white/50" : "border-gray-300 text-gray-600"
              )}
            >
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-3 py-2 bg-gray-50 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-3 py-2">{children}</td>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "underline",
                isInverted
                  ? "text-white hover:text-gray-200"
                  : "text-blue-600 hover:text-blue-800"
              )}
            >
              {children}
            </a>
          ),

          // Text formatting
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => (
            <hr
              className={cn(
                "my-4",
                isInverted ? "border-white/30" : "border-gray-300"
              )}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
