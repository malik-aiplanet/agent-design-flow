
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Agent {
  id: string;
  name: string;
  model: string;
  tools: string[];
  systemPrompt: string;
}

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium mb-2">Agent Setup</h3>
          <p className="text-gray-600">Configure your AI agents and their capabilities.</p>
        </div>
        <Button onClick={addAgent} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      <div className="space-y-4">
        {agents.map((agent, index) => (
          <Card key={agent.id}>
            <Collapsible defaultOpen={index === 0}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Agent Name</Label>
                      <Input
                        value={agent.name}
                        onChange={(e) => updateAgent(agent.id, "name", e.target.value)}
                        placeholder="Enter agent name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Model</Label>
                      <Select value={agent.model} onValueChange={(value) => updateAgent(agent.id, "model", value)}>
                        <SelectTrigger className="mt-1">
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

                  <div>
                    <Label>System Prompt</Label>
                    <Textarea
                      value={agent.systemPrompt}
                      onChange={(e) => updateAgent(agent.id, "systemPrompt", e.target.value)}
                      placeholder="Define the agent's role and behavior..."
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};
