import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { get_client_env } from "@/lib/env";
import { useAppStore } from "@/lib/app-store";

export default function NewChat({ app_type }: { app_type: ComponentType }) {
  const navigate = useNavigate();
  const store = useAppStore();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    console.log(import.meta.env);
    const env = get_client_env();
    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `${token_type} ${access_token}`,
    };

    const response = await axios.post<AppData>(
      `${env.backend_url}/private/sessions`,
      {
        name: formData.get("title"),
        team_id: store.team.id,
        // description: formData.get("description"),
      },
      { headers }
    );

    store.setSelectedApp(response.data);
    store.setApps([...store.apps, response.data]);

    navigate(`/chat/${store.team.id}/${response.data.id}`);
  };

  return (
    <>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "border border-teal-800 text-teal-800 transition-all",
            "hover:bg-teal-500/5 hover:ring hover:ring-teal-800",
            "font-medium text-sm",
            "cursor-pointer w-full py-4.5 rounded-md flex items-center gap-1.5 justify-center"
          )}
        >
          <Plus className="border-2 border-teal-800 rounded-full" />
          <span>
            {app_type === "TextInput" ? "New Conversation" : "New Generation"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="top-64">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input placeholder="Resume Writer" name="title" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Agent to write and update my resume"
              className="resize-none"
              rows={3}
              name="description"
            />
          </div>
          <Button
            className="bg-teal-800 hover:bg-teal-800/90 cursor-pointer"
            type="submit"
          >
            Create
          </Button>
        </form>
      </DialogContent>
    </>
  );
}
