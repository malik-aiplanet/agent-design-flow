
import { useState } from "react";
import { Plus, Search, MessageSquare, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  agentId: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Customer Support Query",
    lastMessage: "Thank you for your help with the billing issue...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    agentId: "1"
  },
  {
    id: "2", 
    title: "Product Information Request",
    lastMessage: "Can you tell me more about the premium features?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    agentId: "1"
  },
  {
    id: "3",
    title: "Technical Support",
    lastMessage: "I'm having trouble with the integration...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    agentId: "1"
  },
  {
    id: "4",
    title: "Pricing Questions",
    lastMessage: "What are the different pricing tiers available?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    agentId: "1"
  },
  {
    id: "5",
    title: "Feature Request",
    lastMessage: "Would it be possible to add dark mode?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    agentId: "1"
  }
];

const ConversationSidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const navigate = useNavigate();
  const { agentId, conversationId } = useParams();

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupConversationsByTime = (conversations: Conversation[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as Conversation[],
      yesterday: [] as Conversation[],
      previous7Days: [] as Conversation[],
      older: [] as Conversation[]
    };

    conversations.forEach(conv => {
      if (conv.timestamp >= today) {
        groups.today.push(conv);
      } else if (conv.timestamp >= yesterday) {
        groups.yesterday.push(conv);
      } else if (conv.timestamp >= sevenDaysAgo) {
        groups.previous7Days.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  };

  const groupedConversations = groupConversationsByTime(filteredConversations);

  const handleNewChat = () => {
    const newConversationId = Date.now().toString();
    navigate(`/chat/${agentId}/${newConversationId}`);
  };

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/chat/${agentId}/${conversation.id}`);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days === 1) {
      return "Yesterday";
    } else {
      return `${days}d ago`;
    }
  };

  const ConversationGroup = ({ title, conversations }: { title: string; conversations: Conversation[] }) => {
    if (conversations.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors relative ${
                conversationId === conversation.id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {conversation.title}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {conversation.lastMessage}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatTime(conversation.timestamp)}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={handleNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <ConversationGroup title="Today" conversations={groupedConversations.today} />
          <ConversationGroup title="Yesterday" conversations={groupedConversations.yesterday} />
          <ConversationGroup title="Previous 7 days" conversations={groupedConversations.previous7Days} />
          <ConversationGroup title="Older" conversations={groupedConversations.older} />
          
          {filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No conversations found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationSidebar;
