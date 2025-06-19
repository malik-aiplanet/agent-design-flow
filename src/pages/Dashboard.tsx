import { useState } from "react";
import { Plus, Search, Filter, Edit, Copy, Trash2, MoreVertical, Play, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useTeams, useDeleteTeam } from "../hooks/useTeams";
import { Team2 } from "../types/team";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch real team data using the useTeams hook
  const { data: teamsResponse, isLoading, error } = useTeams();
  const teams = teamsResponse?.items || [];

  // Delete team hook
  const deleteTeamMutation = useDeleteTeam();

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || team.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Inactive":
        return "bg-red-50 text-red-700 border-red-200";
      case "Draft":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const handleTeamCardClick = (team: Team2) => {
    navigate(`/team/edit/${team.id}`, { state: { teamData: team } });
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (window.confirm(`Are you sure you want to delete the team "${teamName}"? This action cannot be undone.`)) {
      try {
        await deleteTeamMutation.mutateAsync({ id: teamId, permanent: false });
        toast({
          title: "Team deleted",
          description: `Team "${teamName}" has been successfully deleted.`,
        });
      } catch (error) {
        console.error("Failed to delete team:", error);
        toast({
          title: "Error",
          description: "Failed to delete team. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="text-red-500 text-xl font-semibold mb-3">Error loading teams</div>
          <p className="text-slate-400 mb-8 text-base">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const totalTeams = teams.length;
  const activeTeams = teams.filter(t => t.status === "Active").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Workflows</h1>
            <p className="text-slate-600 text-lg">Manage and deploy your intelligent workflows</p>
          </div>
          <Link to="/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-auto flex items-center gap-3 font-semibold transition-colors rounded-lg py-[10px] px-[16px] text-sm">
              <Plus className="h-5 w-5" />
              Create New Workflow
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-semibold mb-2">Total Workflows</p>
                  <p className="text-4xl font-bold text-blue-900">{totalTeams}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200">
                  <Users className="h-7 w-7 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-semibold mb-2">Active Workflows</p>
                  <p className="text-4xl font-bold text-green-900">{activeTeams}</p>
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
          <Input placeholder="Search workflows by name or description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-12 h-14 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-base" />
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
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Team Cards */}
      <div className="grid gap-6">
        {filteredTeams.map(team => (
          <Card
            key={team.id}
            className="hover:shadow-lg transition-all duration-300 bg-white border-slate-200 border-2 overflow-hidden cursor-pointer hover:border-blue-300 group h-[280px]"
            onClick={() => handleTeamCardClick(team)}
          >
            <CardContent className="p-0">
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[70%]">
                        {team.name}
                      </h3>
                      <Badge className={`${getStatusColor(team.status)} border-2 font-semibold px-3 py-1`}>
                        {team.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-base mb-6 leading-relaxed line-clamp-3">{team.description}</p>

                    <div className="flex items-center gap-6 text-sm text-slate-500 mt-auto">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">Type:</span> {team.teamType}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {team.participantsCount} participants
                      </span>
                      <span>•</span>
                      <span>Max turns: {team.maxTurns}</span>
                      <span>•</span>
                      <span>Last modified {team.lastModified}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    {team.status === "Active" && (
                      <Link to={`/chat/${team.id}`}>
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
                      onClick={() => handleTeamCardClick(team)}
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
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.id, team.name);
                          }}
                        >
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
      {filteredTeams.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-200">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <div className="text-slate-500 text-xl font-semibold mb-3">No teams found</div>
          <p className="text-slate-400 mb-8 text-base">Try adjusting your search terms or create your first workflow</p>
          <Link to="/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto rounded-lg font-semibold text-base">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Workflow
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
