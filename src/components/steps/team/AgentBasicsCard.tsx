
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bot } from "lucide-react";

interface AgentBasicsCardProps {
  data?: {
    name?: string;
    description?: string;
  };
  onUpdate?: (data: { name: string; description: string }) => void;
}

export const AgentBasicsCard = ({ data, onUpdate }: AgentBasicsCardProps) => {
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");

  const handleNameChange = (value: string) => {
    setName(value);
    onUpdate?.({ name: value, description });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onUpdate?.({ name, description: value });
  };

  return (
    <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-blue-600" />
          </div>
          Agent Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="agent-name" className="text-sm font-medium text-gray-700">
            Agent Name *
          </Label>
          <Input
            id="agent-name"
            placeholder="e.g., Customer Support Agent, Content Writer..."
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            id="agent-description"
            placeholder="Describe what this agent does and how it helps users..."
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};
