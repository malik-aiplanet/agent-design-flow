
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import ConversationSidebar from "@/components/ConversationSidebar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

const ChatInterface = () => {
  const { agentId, conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI agent. How can I help you today?",
      sender: "agent",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      // In a real app, you would load the conversation messages here
      setMessages([
        {
          id: "1",
          content: "Hello! I'm your AI agent. How can I help you today?",
          sender: "agent",
          timestamp: new Date()
        }
      ]);
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your request. Let me help you with that. This is a simulated response from your deployed AI agent.",
        sender: "agent",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation Sidebar */}
      <ConversationSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="font-medium text-gray-900">Customer Support Agent</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Badge variant="secondary" className="text-xs">GPT-4</Badge>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                  {conversationId && (
                    <Badge variant="outline" className="text-xs">
                      Chat {conversationId.slice(-6)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-3 max-w-2xl ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {message.sender === "user" ? 
                      <User className="h-4 w-4" /> : 
                      <Bot className="h-4 w-4" />
                    }
                  </div>
                  
                  <Card className={`${
                    message.sender === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white"
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className={`text-xs mt-2 ${
                        message.sender === "user" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <Card className="bg-white">
                    <CardContent className="p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-11 px-3">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="h-11 pr-12"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                  className="absolute right-1 top-1 h-9 w-9 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
