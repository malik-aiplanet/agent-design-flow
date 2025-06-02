import { useState } from "react";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
    setSelectedAgents(prev => prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]);
  };
  return;
};