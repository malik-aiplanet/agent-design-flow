
import { useState } from "react";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const availableAgents = [{
  id: "agent1",
  name: "Agent 1",
  description: "Primary research agent"
}, {
  id: "agent2",
  name: "Agent 2",
  description: "Analysis specialist"
}, {
  id: "agent3",
  name: "Agent 3",
  description: "Content generator"
}];

export const AgentsSelectionCard = () => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId) 
        : [...prev, agentId]
    );
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-blue-600" />
          </div>
          Sub Agents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Select agents to include in your workflow
        </Label>
        <div className="space-y-3">
          {availableAgents.map(agent => (
            <div key={agent.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
              <Checkbox
                id={agent.id}
                checked={selectedAgents.includes(agent.id)}
                onCheckedChange={() => toggleAgent(agent.id)}
              />
              <div className="flex-1">
                <Label htmlFor={agent.id} className="font-medium text-gray-900 cursor-pointer">
                  {agent.name}
                </Label>
                <p className="text-sm text-gray-500">{agent.description}</p>
              </div>
            </div>
          ))}
        </div>
        {selectedAgents.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {selectedAgents.length} agent{selectedAgents.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
