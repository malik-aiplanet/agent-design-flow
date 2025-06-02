
import { useState } from "react";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const availableAgents = [
  {
    id: "agent1",
    name: "Agent 1",
    description: "Primary research agent"
  },
  {
    id: "agent2", 
    name: "Agent 2",
    description: "Analysis specialist"
  },
  {
    id: "agent3",
    name: "Agent 3", 
    description: "Content generator"
  }
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
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Available Agents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableAgents.map((agent) => (
          <div key={agent.id} className="flex items-center space-x-3 p-3 border rounded-lg">
            <Checkbox
              id={agent.id}
              checked={selectedAgents.includes(agent.id)}
              onCheckedChange={() => toggleAgent(agent.id)}
            />
            <div className="flex-1">
              <label htmlFor={agent.id} className="font-medium cursor-pointer">
                {agent.name}
              </label>
              <p className="text-sm text-gray-500">{agent.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
