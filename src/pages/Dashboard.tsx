
import { useState } from "react";
import { Plus, Search, Filter, Edit, Copy, Trash2, MoreVertical, Play, Pause, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface Agent {
  id: string;
  name: string;
  model: string;
  status: "Draft" | "Active" | "Deployed";
  lastEdited: string;
  description?: string;
  interactions?: number;
  successRate?: number;
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Agent",
    model: "GPT-4",
    status: "Active",
    lastEdited: "2 hours ago",
    description: "Handles customer inquiries and support tickets with intelligent routing and escalation",
    interactions: 1247,
    successRate: 94
  },
  {
    id: "2", 
    name: "Content Writer",
    model: "GPT-4",
    status: "Draft",
    lastEdited: "1 day ago",
    description: "Creates engaging blog posts, marketing content, and social media copy",
    interactions: 0,
    successRate: 0
  },
  {
    id: "3",
    name: "Data Analyst",
    model: "Claude-3",
    status: "Deployed",
    lastEdited: "3 days ago",
    description: "Analyzes complex datasets and generates actionable business insights",
    interactions: 856,
    successRate: 98
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
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Draft": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Deployed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === "Active" || a.status === "Deployed").length;
  const totalInteractions = agents.reduce((sum, agent) => sum + (agent.interactions || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agents</h1>
            <p className="text-gray-600 text-lg">Manage and deploy your intelligent automation</p>
          </div>
          <Link to="/create">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg">
              <Plus className="h-5 w-5" />
              Create New Agent
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Total Agents</p>
                  <p className="text-3xl font-bold text-blue-900">{totalAgents}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">Active Agents</p>
                  <p className="text-3xl font-bold text-green-900">{activeAgents}</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-medium">Total Interactions</p>
                  <p className="text-3xl font-bold text-purple-900">{totalInteractions.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search agents by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-12 border-gray-300">
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

      {/* Enhanced Agent Cards */}
      <div className="grid gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-xl transition-all duration-300 bg-white border-gray-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                      <Badge className={`${getStatusColor(agent.status)} border font-medium`}>
                        {agent.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{agent.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Model:</span> {agent.model}
                      </span>
                      <span>•</span>
                      <span>Last edited {agent.lastEdited}</span>
                    </div>

                    {/* Performance Metrics */}
                    {agent.interactions > 0 && (
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">{agent.interactions?.toLocaleString()} interactions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">{agent.successRate}% success rate</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {agent.status === "Deployed" && (
                      <Link to={`/chat/${agent.id}`}>
                        <Button variant="outline" size="sm" className="h-10 px-4 border-gray-300 hover:bg-gray-50">
                          <Play className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <div className="text-gray-500 text-xl font-medium mb-2">No agents found</div>
          <p className="text-gray-400 mb-6">Try adjusting your search terms or create your first agent</p>
          <Link to="/create">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Agent
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
