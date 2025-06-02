
import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToolConfigurationDrawer } from "@/components/drawers/ToolConfigurationDrawer";

interface Tool {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  lastModified: string;
}

const mockTools: Tool[] = [
  {
    id: "1",
    name: "Web Scraper",
    description: "Extract data from web pages with intelligent content recognition",
    status: "Active",
    lastModified: "2 hours ago"
  },
  {
    id: "2", 
    name: "Email Sender",
    description: "Send automated emails with templating and personalization",
    status: "Active",
    lastModified: "1 day ago"
  },
  {
    id: "3",
    name: "File Processor",
    description: "Process and analyze various file formats including PDF, CSV, and images",
    status: "Inactive",
    lastModified: "3 days ago"
  }
];

const ToolsManagement = () => {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tool.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  };

  const handleCardClick = (tool: Tool) => {
    setSelectedTool(tool);
    setDrawerOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tools</h1>
            <p className="text-slate-600 text-lg">Manage and configure your automation tools</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-auto flex items-center gap-3 font-semibold transition-colors rounded-lg py-[10px] px-[16px] text-sm">
            <Plus className="h-5 w-5" />
            Add New Tool
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-semibold mb-2">Total Tools</p>
                  <p className="text-4xl font-bold text-blue-900">{tools.length}</p>
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
                  <p className="text-green-700 text-sm font-semibold mb-2">Active Tools</p>
                  <p className="text-4xl font-bold text-green-900">
                    {tools.filter(t => t.status === "Active").length}
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
            placeholder="Search tools..." 
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
        {filteredTools.map(tool => (
          <Card 
            key={tool.id} 
            className="hover:shadow-lg transition-all duration-300 bg-white border-slate-200 border-2 overflow-hidden cursor-pointer hover:border-blue-300 group"
            onClick={() => handleCardClick(tool)}
          >
            <CardContent className="p-0">
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                      <Badge className={`${getStatusColor(tool.status)} border-2 font-semibold px-3 py-1`}>
                        {tool.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-base mb-6 leading-relaxed">{tool.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <span>Last modified {tool.lastModified}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 px-4 border-2 border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-semibold"
                      onClick={() => handleCardClick(tool)}
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

      {filteredTools.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-200">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <div className="text-slate-500 text-xl font-semibold mb-3">No tools found</div>
          <p className="text-slate-400 mb-8 text-base">Try adjusting your search terms or create your first tool</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto rounded-lg font-semibold text-base">
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Tool
          </Button>
        </div>
      )}

      <ToolConfigurationDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tool={selectedTool}
      />
    </div>
  );
};

export default ToolsManagement;
