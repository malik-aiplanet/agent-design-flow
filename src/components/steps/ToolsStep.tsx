
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  actions: number;
  enabled: boolean;
}

const availableTools: Tool[] = [
  {
    id: "taskade-actions",
    name: "Taskade Actions",
    description: "Use your agent to manage tasks in your projects, update due dates, assignments, and more.",
    icon: "🧑‍🤝‍🧑",
    actions: 5,
    enabled: true
  },
  {
    id: "taskade-ai",
    name: "Taskade AI",
    description: "Access Taskade's AI capabilities for content generation and analysis.",
    icon: "🤖",
    actions: 2,
    enabled: false
  },
  {
    id: "media",
    name: "Media",
    description: "Handle image processing, file uploads, and multimedia content.",
    icon: "🎬",
    actions: 3,
    enabled: true
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send messages, create channels, and manage Slack communications.",
    icon: "💬",
    actions: 5,
    enabled: false
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send emails, read messages, and manage Gmail functionality.",
    icon: "📧",
    actions: 3,
    enabled: false
  }
];

export const ToolsStep = ({ data, onUpdate }: any) => {
  const [tools, setTools] = useState<Tool[]>(availableTools);

  const toggleTool = (toolId: string) => {
    setTools(tools.map(tool =>
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Available Tools</h3>
        <p className="text-gray-600">Select the tools your agent can use to perform actions.</p>
      </div>

      <div className="space-y-3">
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className={`cursor-pointer transition-colors ${
              tool.enabled ? "border-blue-200 bg-blue-50" : "hover:bg-gray-50"
            }`}
            onClick={() => toggleTool(tool.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{tool.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{tool.name}</h4>
                      <span className="text-sm text-gray-500">{tool.actions} actions</span>
                    </div>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                </div>
                
                <Switch
                  checked={tool.enabled}
                  onCheckedChange={() => toggleTool(tool.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {tools.filter(t => t.enabled).length} of {tools.length} tools selected
      </div>
    </div>
  );
};
