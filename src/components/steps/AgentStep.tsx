
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";

interface Agent {
  id: string;
  name: string;
  model: string;
  tools: string[];
  systemPrompt: string;
}

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
    id: "slack",
    name: "Slack",
    description: "5 actions",
    icon: "💬",
    actions: 5,
    enabled: false
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "3 actions",
    icon: "📧",
    actions: 3,
    enabled: false
  },
  {
    id: "database",
    name: "Database",
    description: "4 actions",
    icon: "🗄️",
    actions: 4,
    enabled: false
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "2 actions",
    icon: "📅",
    actions: 2,
    enabled: false
  }
];

export const AgentStep = ({ data, onUpdate }: any) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Primary Agent",
      model: "gpt-4",
      tools: [],
      systemPrompt: "You are a helpful AI assistant."
    }
  ]);

  const [tools, setTools] = useState<Tool[]>(availableTools);

  const addAgent = () => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: "",
      model: "gpt-4",
      tools: [],
      systemPrompt: ""
    };
    setAgents([...agents, newAgent]);
  };

  const removeAgent = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  const updateAgent = (id: string, field: string, value: any) => {
    setAgents(agents.map(agent =>
      agent.id === id ? { ...agent, [field]: value } : agent
    ));
  };

  const toggleTool = (toolId: string) => {
    setTools(tools.map(tool =>
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium mb-2">Agent Setup</h3>
          <p className="text-gray-600">Configure your AI agents and their capabilities.</p>
        </div>
      </div>

      <div className="space-y-6">
        {agents.map((agent, index) => (
          <Card key={agent.id} className="border border-gray-200">
            <Collapsible defaultOpen={index === 0}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                      {agent.name || `Agent ${index + 1}`}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {agents.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAgent(agent.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="space-y-8 pt-0 px-8 pb-8">
                  {/* Primary Agent Section */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Primary Agent</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium">Agent Name</Label>
                          <Input
                            value={agent.name}
                            onChange={(e) => updateAgent(agent.id, "name", e.target.value)}
                            placeholder="Enter agent name"
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Model</Label>
                          <Select value={agent.model} onValueChange={(value) => updateAgent(agent.id, "model", value)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="claude-3">Claude-3</SelectItem>
                              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* System Prompt Section */}
                    <div className="border-t pt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">System Prompt</h4>
                      <Textarea
                        value={agent.systemPrompt}
                        onChange={(e) => updateAgent(agent.id, "systemPrompt", e.target.value)}
                        placeholder="Define the agent's role and behavior..."
                        className="min-h-[120px] resize-none"
                      />
                    </div>

                    {/* Tools Section */}
                    <div className="border-t pt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Tools</h4>
                      <div className="space-y-3">
                        {tools.map((tool) => (
                          <Card 
                            key={tool.id} 
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              tool.enabled ? "border-blue-200 bg-blue-50" : "hover:bg-gray-50"
                            }`}
                            onClick={() => toggleTool(tool.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="text-2xl">{tool.icon}</div>
                                  <div>
                                    <h5 className="font-medium text-gray-900">{tool.name}</h5>
                                    <p className="text-sm text-gray-500">{tool.description}</p>
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
                      
                      <div className="text-sm text-gray-500 mt-4">
                        {tools.filter(t => t.enabled).length} of {tools.length} tools selected
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Add Another Agent Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={addAgent} variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Another Agent
        </Button>
      </div>
    </div>
  );
};
