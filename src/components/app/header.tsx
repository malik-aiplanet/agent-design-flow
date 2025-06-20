import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/app-store";

export default function Header() {
  const store = useAppStore();

  return (
    <div
      className={cn(
        "shadow-xs z-50 border-b border-gray-200",
        "flex justify-between items-center p-4 w-full"
      )}
    >
      <div className="flex gap-2 text-xl font-bold items-center">
        <img className="w-8 h-8" src="/aiplanet-logo.png" alt="Logo" />
        <h2 className="tracking-[-3%]">
          {/* {app.component.label === "TextInput"
            ? "Content Writer Agent"
            : "Text Summarizer"} */}
          {store.selectedApp && store.selectedApp.name}
        </h2>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarImage className="h-8 w-8" src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
