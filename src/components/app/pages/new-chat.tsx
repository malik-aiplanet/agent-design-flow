import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Form } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewChat({ app_type }: { app_type: ComponentType }) {
  const navigate = useNavigate();

  const onClose = () => {
    const prev_app_id = localStorage.getItem("prev_app");
    navigate(`/${prev_app_id}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  return (
    <>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "border border-teal-800 text-teal-800",
            "hover:bg-teal-500/5",
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
        <Form className="flex flex-col gap-4">
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
            className="bg-teal-600 hover:bg-teal-700 cursor-pointer"
            type="submit"
          >
            Create
          </Button>
        </Form>
      </DialogContent>
    </>
  );
}
