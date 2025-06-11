
import { useState, useMemo } from "react";
import { Bot, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTeams } from "@/hooks/useTeams";

interface AgentsSelectionCardProps {
  selectedTeams?: string[];
  onUpdate?: (selectedTeams: string[]) => void;
}

export const AgentsSelectionCard = ({
  selectedTeams = [],
  onUpdate
}: AgentsSelectionCardProps) => {
  const [searchTerm, setSearchTerm] = useState("");

    // Query parameters for fetching teams
  const queryParams = useMemo(() => ({
    name_like: searchTerm || undefined,
    is_active: true,
    limit: 100,
  }), [searchTerm]);

  // Fetch teams from backend
  const { data: teamsResponse, isLoading, error } = useTeams(queryParams);
  const teams = (teamsResponse as any)?.items || [];

  const toggleTeam = (teamId: string) => {
    const updatedSelection = selectedTeams.includes(teamId)
      ? selectedTeams.filter(id => id !== teamId)
      : [...selectedTeams, teamId];

    onUpdate?.(updatedSelection);
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            Sub Agents (Teams)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading teams...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            Sub Agents (Teams)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-600">Error loading teams: {(error as any)?.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-blue-600" />
          </div>
          Sub Agents (Teams)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Select teams to include in your workflow
        </Label>

        {/* Search input */}
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {teams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No teams found. {searchTerm && "Try adjusting your search terms."}
            </div>
          ) : (
            teams.map(team => (
              <div key={team.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <Checkbox
                  id={team.id}
                  checked={selectedTeams.includes(team.id)}
                  onCheckedChange={() => toggleTeam(team.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={team.id} className="font-medium text-gray-900 cursor-pointer">
                    {team.name}
                  </Label>
                  <div className="text-xs text-gray-500 mt-1">
                    {team.teamType} • {team.participantsCount} participants • {team.maxTurns} max turns
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{team.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedTeams.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {selectedTeams.length} team{selectedTeams.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
