
import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface GroupAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  enabled: boolean;
  skills: string[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const availableAgents: GroupAgent[] = [
  {
    id: "research-agent",
    name: "Research Agent",
    role: "Researcher",
    description: "Conducts thorough research and gathers information from various sources",
    enabled: true,
    skills: ["Web Search", "Data Analysis", "Report Writing"]
  },
  {
    id: "content-creator",
    name: "Content Creator",
    role: "Writer",
    description: "Creates engaging content, articles, and marketing materials",
    enabled: false,
    skills: ["Content Writing", "SEO", "Social Media"]
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    role: "Analyst",
    description: "Analyzes data patterns and provides insights and recommendations",
    enabled: true,
    skills: ["Statistical Analysis", "Data Visualization", "Reporting"]
  },
  {
    id: "project-manager",
    name: "Project Manager",
    role: "Manager",
    description: "Coordinates tasks, manages timelines, and ensures project completion",
    enabled: false,
    skills: ["Task Management", "Scheduling", "Communication"]
  }
];

const availableTools: Tool[] = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet for information and real-time data",
    enabled: true
  },
  {
    id: "document-processor",
    name: "Document Processor", 
    description: "Process and analyze various document formats including PDFs and Word files",
    enabled: false
  },
  {
    id: "database-connector",
    name: "Database Connector",
    description: "Connect to and query databases for data retrieval and analysis",
    enabled: true
  },
  {
    id: "email-integration",
    name: "Email Integration",
    description: "Send emails and manage email communications automatically",
    enabled: false
  },
  {
    id: "calendar-manager",
    name: "Calendar Manager",
    description: "Schedule meetings and manage calendar events seamlessly",
    enabled: false
  },
  {
    id: "slack-integration",
    name: "Slack Integration",
    description: "Send messages and notifications through Slack channels",
    enabled: true
  }
];

export const GroupAgentsStep = ({ data, onUpdate }: any) => {
  const [agents, setAgents] = useState<GroupAgent[]>(availableAgents);
  const [tools, setTools] = useState<Tool[]>(availableTools);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAgent = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
    ));
  };

  const toggleTool = (toolId: string) => {
    setTools(tools.map(tool => 
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">Group Agents & Tools</h3>
        <p className="text-gray-600 text-lg">
          Configure multiple agents to work together and select the tools they can use.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search agents and tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Agents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Team Agents</h4>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Agent
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.id}
              className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                agent.enabled 
                  ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                      {agent.name}
                    </h5>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {agent.role}
                    </Badge>
                  </div>
                  <Switch
                    checked={agent.enabled}
                    onCheckedChange={() => toggleAgent(agent.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {agent.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {agent.skills.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {agent.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tools Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Available Tools</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Card
              key={tool.id}
              className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                tool.enabled 
                  ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-sm truncate">
                      {tool.name}
                    </h5>
                  </div>
                  <Switch
                    checked={tool.enabled}
                    onCheckedChange={() => toggleTool(tool.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-3">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
        <div className="flex items-center gap-6">
          <span>{agents.filter(a => a.enabled).length} of {agents.length} agents selected</span>
          <span>{tools.filter(t => t.enabled).length} of {tools.length} tools enabled</span>
        </div>
      </div>
    </div>
  );
};
