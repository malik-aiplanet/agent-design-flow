import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/app-store";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

export default function Header() {
  const store = useAppStore();
  const navigate = useNavigate();
  const params = useParams();

  const handleBack = () => {
    // Navigate to the dashboard/workflow page instead of team chat
    navigate("/");
  };

  // Check if we're in a conversation view
  const showBackButton = params.conversationId !== undefined;

  return (
    <div
      className={cn(
        "shadow-xs z-50 border-b border-gray-200",
        "flex justify-between items-center p-4 w-full"
      )}
    >
      <div className="flex gap-2 text-xl font-bold items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2 flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0 h-8 w-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <img className="w-8 h-8" src="/aiplanet-logo.png" alt="Logo" />
        <h2 className="text-lg font-semibold text-gray-900">
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
