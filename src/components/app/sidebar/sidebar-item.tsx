import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import { NavLink } from "react-router-dom";

type Props = {
  app: AppData;
};

export default function SidebarItem({ app }: Props) {
  const store = useAppStore();
  const onSelectConversation = () => store.setSelectedApp(app);
  const isSelected = store.selectedApp?.id === app.id;

  return (
    <NavLink to={`/chat/${store.team.id}/${app.id}`}>
      <div
        onClick={onSelectConversation}
        className={cn(
          "relative flex gap-2 items-center justify-between",
          "border border-transparent max-h-12",
          "p-3 rounded-lg transition-colors cursor-pointer text-sm font-medium",
          isSelected
            ? "bg-teal-800/10 text-teal-800 font-semibold"
            : "hover:bg-teal-800/15"
        )}
        title={app.name}
      >
        <div className="flex gap-2 items-center truncate">
          <div className="truncate">{app.name}</div>
        </div>
        {isSelected && (
          <Button
            className="cursor-pointer hover:bg-transparent hover:text-red-500/80"
            variant={"ghost"}
          >
            <Trash className="min-w-4 min-h-4 max-w-4 max-h-4" />
          </Button>
        )}
      </div>
    </NavLink>
  );
}
