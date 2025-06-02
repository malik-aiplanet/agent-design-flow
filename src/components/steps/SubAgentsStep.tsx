
import { useState } from "react";
import { Plus, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  status: "Active" | "Inactive";
  tools: string[];
}

// Mock data for available agents (in real app, this would come from the main Agents tab)
const availableAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Agent",
    description: "Handles customer inquiries and support tickets",
    model: "GPT-4",
    status: "Active",
    tools: ["slack", "email"]
  },
  {
    id: "2", 
    name: "Content Writer Agent",
    description: "Creates engaging content and copy",
    model: "GPT-4",
    status: "Active",
    tools: ["research", "writing"]
  },
  {
    id: "3",
    name: "Data Analyst Agent", 
    description: "Analyzes data and generates insights",
    model: "GPT-3.5",
    status: "Active",
    tools: ["database", "analytics"]
  },
  {
    id: "4",
    name: "Marketing Agent",
    description: "Manages marketing campaigns and strategies",
    model: "Claude-3",
    status: "Inactive",
    tools: ["social-media", "analytics"]
  }
];

export const SubAgentsStep = ({ data, onUpdate }: any) => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>(data?.subAgents || []);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = availableAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAgent = (agentId: string) => {
    const updatedSelection = selectedAgents.includes(agentId)
      ? selectedAgents.filter(id => id !== agentId)
      : [...selectedAgents, agentId];
    
    setSelectedAgents(updatedSelection);
    onUpdate?.({ ...data, subAgents: updatedSelection });
  };

  const removeAgent = (agentId: string) => {
    const updatedSelection = selectedAgents.filter(id => id !== agentId);
    setSelectedAgents(updatedSelection);
    onUpdate?.({ ...data, subAgents: updatedSelection });
  };

  const selectedAgentsList = availableAgents.filter(agent => selectedAgents.includes(agent.id));

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">Sub Agents</h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          Select existing agents to add as sub-agents for this workflow. Sub-agents will work together to accomplish complex tasks.
        </p>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Search Agents</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Selected Sub Agents */}
      {selectedAgentsList.length > 0 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">
              Selected Sub Agents ({selectedAgentsList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedAgentsList.map(agent => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{agent.name}</h4>
                    <Badge variant={agent.status === "Active" ? "default" : "secondary"}>
                      {agent.status}
                    </Badge>
                    <Badge variant="outline">{agent.model}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                  <div className="flex gap-1 mt-2">
                    {agent.tools.map(tool => (
                      <Badge key={tool} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAgent(agent.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Available Agents */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Available Agents ({filteredAgents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAgents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No agents found matching your search criteria.
              </div>
            ) : (
              filteredAgents.map(agent => (
                <div
                  key={agent.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedAgents.includes(agent.id)
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleAgent(agent.id)}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedAgents.includes(agent.id)}
                      onCheckedChange={() => toggleAgent(agent.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{agent.name}</h4>
                        <Badge variant={agent.status === "Active" ? "default" : "secondary"}>
                          {agent.status}
                        </Badge>
                        <Badge variant="outline">{agent.model}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                      <div className="flex gap-1">
                        {agent.tools.map(tool => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
              <h4 className="text-sm font-medium text-amber-800">Sub Agent Best Practices</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Select agents with complementary skills for better collaboration</li>
                <li>• Ensure selected agents are active and properly configured</li>
                <li>• Consider the workflow complexity when choosing the number of sub-agents</li>
                <li>• Sub-agents will coordinate automatically based on the main workflow logic</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
