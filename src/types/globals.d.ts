
type Role = "user" | "assistant"
type Message = {
    role: Role;
    content: string;
    id: string;
    file?: FileType
}

type FileType = {
    id: string
    url: string;
    size: number;
    mimetype: string;
    name: string;
}

interface BaseData {
    id: string;
    user_id: string;
    title: string;
    created_at: Date;
    updated_at: Date
    tags?: string[];
}

interface Conversation extends BaseData {
    messages: Message[];
}

interface TextGeneration extends BaseData {
    files: FileType[];
    status: "uploading" | "pending" | "failed" | "completed";
    content: string;
}

type AppType = "chat" | "generation"
type Data =
    | {
          type: "chat";
          data: Conversation;
      }
    | {
          type: "generation";
          data: TextGeneration;
      };



