
import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Agents2ConfigurationDrawer } from "@/components/drawers/Agents2ConfigurationDrawer";

interface Agent2 {
  id: string;
  name: string;
  description: string;
  modelClient: string;
  status: "Active" | "Inactive";
  lastModified: string;
  toolsCount: number;
}

const mockAgents2: Agent2[] = [
  {
    id: "1",
    name: "Research Assistant",
    description: "AI agent specialized in research and data analysis tasks",
    modelClient: "gpt-4-turbo-preview",
    status: "Active",
    lastModified: "2 hours ago",
    toolsCount: 3
  },
  {
    id: "2",
    name: "Content Creator",
    description: "Agent focused on content generation and creative writing",
    modelClient: "gpt-4",
    status: "Active", 
    lastModified: "1 day ago",
    toolsCount: 5
  },
  {
    id: "3",
    name: "Code Reviewer",
    description: "Specialized agent for code review and analysis",
    modelClient: "claude-3-opus",
    status: "Inactive",
    lastModified: "3 days ago",
    toolsCount: 2
  }
];

const Agents2Management = () => {
  const [agents, setAgents] = useState<Agent2[]>(mockAgents2);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent2 | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  };

  const handleCardClick = (agent: Agent2) => {
    setSelectedAgent(agent);
    setDrawerOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAgent(null);
    setDrawerOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Agents_2</h1>
            <p className="text-slate-600 text-lg">Manage and configure your specialized AI agents</p>
          </div>
          <Button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white h-auto flex items-center gap-3 font-semibold transition-colors rounded-lg py-[10px] px-[16px] text-sm"
          >
            <Plus className="h-5 w-5" />
            Add New Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-semibold mb-2">Total Agents</p>
                  <p className="text-4xl font-bold text-blue-900">{agents.length}</p>
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
                  <p className="text-4xl font-bold text-green-900">
                    {agents.filter(a => a.status === "Active").length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-200">
                  <Plus className="h-7 w-7 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input 
            placeholder="Search agents..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="pl-12 h-14 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-base" 
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-14 border-slate-300 text-base">
            <Filter className="h-5 w-5 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredAgents.map(agent => (
          <Card 
            key={agent.id} 
            className="hover:shadow-lg transition-all duration-300 bg-white border-slate-200 border-2 overflow-hidden cursor-pointer hover:border-blue-300 group"
            onClick={() => handleCardClick(agent)}
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
                        <span className="font-semibold">Model:</span> {agent.modelClient}
                      </span>
                      <span>•</span>
                      <span>{agent.toolsCount} tools</span>
                      <span>•</span>
                      <span>Last modified {agent.lastModified}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 px-4 border-2 border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-semibold"
                      onClick={() => handleCardClick(agent)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-slate-100">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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

      {filteredAgents.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-200">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <div className="text-slate-500 text-xl font-semibold mb-3">No agents found</div>
          <p className="text-slate-400 mb-8 text-base">Try adjusting your search terms or create your first agent</p>
          <Button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto rounded-lg font-semibold text-base"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Agent
          </Button>
        </div>
      )}

      <Agents2ConfigurationDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        agent={selectedAgent}
      />
    </div>
  );
};

export default Agents2Management;
