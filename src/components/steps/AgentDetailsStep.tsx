
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bot } from "lucide-react";

export const AgentDetailsStep = ({ data, onUpdate, isEditMode }: any) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Initialize with data when in edit mode
  useEffect(() => {
    if (isEditMode && data) {
      setName(data.name || "");
      setDescription(data.description || "");
    }
  }, [isEditMode, data]);

  const handleNameChange = (value: string) => {
    setName(value);
    onUpdate?.({ ...data, name: value, description });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onUpdate?.({ ...data, name, description: value });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Agent Details" : "Agent Details"}
        </h3>
        <p className="text-gray-600 text-lg">
          {isEditMode 
            ? "Update your agent's basic information and identity."
            : "Configure your agent's basic information and identity. This forms the foundation of your agent's profile."
          }
        </p>
      </div>

      {/* Agent Basics */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agent-name" className="text-sm font-medium text-gray-700">
              Agent Name *
            </Label>
            <Input
              id="agent-name"
              placeholder="e.g., Customer Support Agent, Content Writer, Data Analyst..."
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              Give your agent a descriptive and memorable name that reflects its purpose.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="agent-description"
              placeholder="Describe what this agent does, its main capabilities, and how it helps users accomplish their goals..."
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="min-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              Provide a clear explanation of the agent's purpose, main capabilities, and use cases.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs font-bold">!</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-amber-800">Best Practices</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Use clear, descriptive names that indicate the agent's function</li>
                <li>• Write descriptions that help users understand when to use this agent</li>
                <li>• Consider your target audience when crafting the description</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
