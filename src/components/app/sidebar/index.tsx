import { useEffect, useState } from "react";
import SidebarItem from "./sidebar-item";
import { Dialog } from "@/components/ui/dialog";
import NewChat from "./new-chat-button";
import { useAppStore } from "@/lib/app-store";

export default function Sidebar() {
  const store = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!store.selectedApp);
  }, [store.selectedApp]);

  return (
    <div className="flex flex-col bg-white border-r border-gray-200 w-72 h-full py-4">
      <div className="px-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <NewChat app_type={store.selectedApp?.type ?? "TextInput"} />
        </Dialog>
      </div>

      {store.apps.length === 0 ? (
        <div className="p-4 text-lg">No conversations</div>
      ) : (
        <div className="flex flex-col py-6 gap-2 px-4 overflow-y-auto">
          <h4 className="text-xs mb-5">Recent Conversations</h4>
          {store.apps.map((app) => (
            <SidebarItem key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
