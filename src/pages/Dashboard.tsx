
import { useState } from "react";
import { Plus, Search, Filter, Edit, Copy, Trash2, MoreVertical, Play, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { AgentConfigurationDrawer } from "@/components/drawers/AgentConfigurationDrawer";

interface Agent {
  id: string;
  name: string;
  model: string;
  status: "Draft" | "Active" | "Deployed";
  lastEdited: string;
  description?: string;
}

const mockAgents: Agent[] = [{
  id: "1",
  name: "Customer Support Agent",
  model: "GPT-4",
  status: "Active",
  lastEdited: "2 hours ago",
  description: "Handles customer inquiries and support tickets with intelligent routing and escalation"
}, {
  id: "2",
  name: "Content Writer",
  model: "GPT-4",
  status: "Draft",
  lastEdited: "1 day ago",
  description: "Creates engaging blog posts, marketing content, and social media copy"
}, {
  id: "3",
  name: "Data Analyst",
  model: "Claude-3",
  status: "Deployed",
  lastEdited: "3 days ago",
  description: "Analyzes complex datasets and generates actionable business insights"
}];

const Dashboard = () => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Draft":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Deployed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const handleAgentCardClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setDrawerOpen(true);
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === "Active" || a.status === "Deployed").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Agents</h1>
            <p className="text-slate-600 text-lg">Manage and deploy your intelligent agents</p>
          </div>
          <Link to="/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-auto flex items-center gap-3 font-semibold transition-colors rounded-lg py-[10px] px-[16px] text-sm">
              <Plus className="h-5 w-5" />
              Create New Agent
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-semibold mb-2">Total Agents</p>
                  <p className="text-4xl font-bold text-blue-900">{totalAgents}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200">
                  <Plus className="h-7 w-7 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-semibold mb-2">Active Agents</p>
                  <p className="text-4xl font-bold text-green-900">{activeAgents}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-200">
                  <Play className="h-7 w-7 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input placeholder="Search agents by name or description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-12 h-14 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-base" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-14 border-slate-300 text-base">
            <Filter className="h-5 w-5 mr-2" />
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
        {filteredAgents.map(agent => (
          <Card 
            key={agent.id} 
            className="hover:shadow-lg transition-all duration-300 bg-white border-slate-200 border-2 overflow-hidden cursor-pointer hover:border-blue-300 group"
            onClick={() => handleAgentCardClick(agent)}
          >
            <CardContent className="p-0">
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {agent.name}
                      </h3>
                      <Badge className={`${getStatusColor(agent.status)} border-2 font-semibold px-3 py-1`}>
                        {agent.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-base mb-6 leading-relaxed">{agent.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">Model:</span> {agent.model}
                      </span>
                      <span>•</span>
                      <span>Last edited {agent.lastEdited}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    {agent.status === "Deployed" && (
                      <Link to={`/chat/${agent.id}`}>
                        <Button variant="outline" size="sm" className="h-12 px-6 border-2 border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-semibold">
                          <Play className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-12 px-6 border-2 border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-semibold"
                      onClick={() => handleAgentCardClick(agent)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-12 w-12 p-0 hover:bg-slate-100">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-200">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <div className="text-slate-500 text-xl font-semibold mb-3">No agents found</div>
          <p className="text-slate-400 mb-8 text-base">Try adjusting your search terms or create your first agent</p>
          <Link to="/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto rounded-lg font-semibold text-base">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Agent
            </Button>
          </Link>
        </div>
      )}

      <AgentConfigurationDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        agent={selectedAgent}
      />
    </div>
  );
};

export default Dashboard;
