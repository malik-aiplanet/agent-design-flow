import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  className?: string;
  data: string;
};

export default function CopyButton({ data, className = "" }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await navigator.clipboard.writeText(data);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      className={cn("cursor-pointer relative", className)}
      size="icon"
      variant={"ghost"}
      onClick={onClick}
      disabled={isCopied}
    >
      <div className="relative w-4 h-4">
        <Copy
          className={cn(
            "absolute inset-0 transition-all duration-200",
            isCopied
              ? "opacity-0 scale-50 rotate-90"
              : "opacity-100 scale-100 rotate-0"
          )}
        />
        <Check
          className={cn(
            "absolute inset-0 transition-all duration-200",
            isCopied
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-50 -rotate-90"
          )}
        />
      </div>
    </Button>
  );
}
