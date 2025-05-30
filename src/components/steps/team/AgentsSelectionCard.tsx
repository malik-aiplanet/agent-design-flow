
import { useState } from "react";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const availableAgents = [
  { id: "agent1", name: "Agent 1", description: "Primary research agent" },
  { id: "agent2", name: "Agent 2", description: "Analysis specialist" },
  { id: "agent3", name: "Agent 3", description: "Content generator" }
];

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-5 w-5 text-green-600" />
          Agents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {availableAgents.map(agent => (
            <div key={agent.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <Checkbox 
                checked={selectedAgents.includes(agent.id)}
                onCheckedChange={() => toggleAgent(agent.id)}
              />
              <div className="flex-1">
                <div className="font-medium">{agent.name}</div>
                <div className="text-sm text-gray-500">{agent.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
