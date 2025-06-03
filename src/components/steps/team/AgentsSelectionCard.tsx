
import { useState } from "react";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-600" />
          Sub Agents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {availableAgents.map(agent => (
            <div key={agent.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Checkbox
                id={agent.id}
                checked={selectedAgents.includes(agent.id)}
                onCheckedChange={() => toggleAgent(agent.id)}
              />
              <div className="flex-1">
                <Label 
                  htmlFor={agent.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {agent.name}
                </Label>
                <p className="text-xs text-gray-500 mt-1">{agent.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {selectedAgents.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Select sub agents to include in your workflow.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
