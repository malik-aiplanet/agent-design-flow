
import { useState } from "react";
import { Plus, Search, Filter, Edit, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

interface Agent {
  id: string;
  name: string;
  model: string;
  status: "Draft" | "Active" | "Deployed";
  lastEdited: string;
  description?: string;
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Agent",
    model: "GPT-4",
    status: "Active",
    lastEdited: "2 hours ago",
    description: "Handles customer inquiries and support tickets"
  },
  {
    id: "2", 
    name: "Content Writer",
    model: "GPT-4",
    status: "Draft",
    lastEdited: "1 day ago",
    description: "Creates blog posts and marketing content"
  },
  {
    id: "3",
    name: "Data Analyst",
    model: "Claude-3",
    status: "Deployed",
    lastEdited: "3 days ago",
    description: "Analyzes data and generates insights"
  }
];

const Dashboard = () => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      case "Deployed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">All Agents</h1>
          <p className="text-gray-600 mt-1">Manage and deploy your AI agents</p>
        </div>
        <Link to="/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-11">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="deployed">Deployed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent Cards */}
      <div className="grid gap-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="p-6 hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                    <Badge className={`${getStatusColor(agent.status)} border-0`}>
                      {agent.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{agent.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Model: {agent.model}</span>
                    <span>•</span>
                    <span>Last edited {agent.lastEdited}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {agent.status === "Deployed" && (
                    <Link to={`/chat/${agent.id}`}>
                      <Button variant="outline" size="sm" className="h-9 px-3">
                        Chat
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No agents found</div>
          <p className="text-gray-500">Try adjusting your search or create a new agent</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
