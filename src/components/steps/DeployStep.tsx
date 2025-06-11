import { useState } from "react";
import { CheckCircle, Loader2, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCreateTeam } from "@/hooks/useTeams";
import { TeamCreateRequest } from "@/types/team";
export const DeployStep = ({
  data,
  onUpdate,
  hasUnsavedChanges,
  onSave
}: any) => {
  const [teamId, setTeamId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Hooks for workflow operations
  const createTeamMutation = useCreateTeam();
  // No separate deploy step - creating the team is the deployment

  const handleCreateTeam = async () => {
    if (hasUnsavedChanges) {
      onSave();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Transform collected data into team component config using selected team template
    const selectedTemplate = data?.selectedTeamTemplate;

    // Map team type labels to full provider paths
    const teamTypeMap: Record<string, string> = {
      "RoundRobinGroupChat": "autogen_agentchat.teams.RoundRobinGroupChat",
      "SelectorGroupChat": "autogen_agentchat.teams.SelectorGroupChat",
      "Swarm": "autogen_agentchat.teams.Swarm"
    };

    const teamConfig: TeamCreateRequest = {
      component: {
        provider: teamTypeMap[data?.teamType as string] || selectedTemplate?.provider || "autogen_agentchat.teams.RoundRobinGroupChat",
        component_type: "team",
        version: 1,
        component_version: 1,
        description: data?.description || selectedTemplate?.description || "AI workflow team",
        label: data?.name || "Untitled Workflow",
        config: {
          // Use the team configuration from Step 3
          ...data?.teamConfig,
          // Ensure participants are included from the template
          participants: data?.teamConfig?.participants || selectedTemplate?.config?.participants || [],
        }
      }
    };

    try {
      const result = await createTeamMutation.mutateAsync(teamConfig);
      setTeamId(result.id);
    } catch (error) {
      console.error("Failed to create workflow:", error);
    }
  };

  const handleDeployTeam = async () => {
    // Since creating the team IS the deployment, just navigate to success
    if (teamId) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const handleTest = () => {
    // Navigate to chat interface for testing
    if (teamId) {
      navigate(`/chat/${teamId}`);
    } else {
      navigate("/chat/test");
    }
  };

  const isCreating = createTeamMutation.isPending;
  const isCreated = !!teamId;
  const isDeployed = createTeamMutation.isSuccess; // Creating IS deploying
  return <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Deploy Your Workflow</h3>
        <p className="text-gray-600">Review your configuration and deploy your AI workflow.</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workflow Summary</CardTitle>
        </CardHeader>
                <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Workflow Name</span>
              <p className="font-medium">{data?.name || "Untitled Workflow"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Team Type</span>
              <p className="font-medium">
                {data?.teamType === "RoundRobinGroupChat" ? "Round Robin Group Chat" :
                 data?.teamType === "SelectorGroupChat" ? "Selector Group Chat" :
                 data?.teamType === "Swarm" ? "Swarm" :
                 data?.teamType || "Not Selected"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Model Provider</span>
              <p className="font-medium">{data?.modelProvider || "Not Set"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Participants</span>
              <p className="font-medium">{data?.teamConfig?.participants?.length || data?.selectedTeamTemplate?.config?.participants?.length || 0} agents</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Max Turns</span>
              <p className="font-medium">{data?.teamConfig?.max_turns || 10}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Team Events</span>
              <p className="font-medium">{data?.teamConfig?.emit_team_events ? "Enabled" : "Disabled"}</p>
            </div>
          </div>

          {data?.description && (
            <div>
              <span className="text-sm text-gray-500">Description</span>
              <p className="font-medium text-sm">{data.description}</p>
            </div>
          )}

          {data?.inputComponents && data.inputComponents.length > 0 && (
            <div>
              <span className="text-sm text-gray-500">Input Types</span>
              <div className="flex gap-2 mt-1">
                {data.inputComponents.map((input: any, index: number) => (
                  <Badge key={index} variant="secondary">{input.type}</Badge>
                ))}
              </div>
            </div>
          )}

          {data?.outputFormat && data.outputFormat.length > 0 && (
            <div>
              <span className="text-sm text-gray-500">Output Format</span>
              <div className="flex gap-2 mt-1">
                {data.outputFormat.map((format: string, index: number) => (
                  <Badge key={index} variant="secondary">{format}</Badge>
                ))}
              </div>
            </div>
          )}

          {data?.terminationConditions && data.terminationConditions.length > 0 && (
            <div>
              <span className="text-sm text-gray-500">Termination Conditions</span>
              <div className="flex gap-2 mt-1">
                {data.terminationConditions.map((condition: string, index: number) => (
                  <Badge key={index} variant="secondary">{condition}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium">You have unsaved changes that will be saved before deployment.</span>
            </div>
          </CardContent>
        </Card>}

            {/* Deployment Status */}
      {isDeployed && <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-900 mb-2">Workflow Deployed Successfully! 🎉</h3>
            <p className="text-green-700">Your workflow is now ready to use.</p>
          </CardContent>
        </Card>}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handleTest}
          disabled={isCreating}
          className="flex-1"
        >
          Run Test
        </Button>

        {!isCreated ? (
          <Button
            onClick={handleCreateTeam}
            disabled={isCreating}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating & Deploying Workflow...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                {hasUnsavedChanges ? "Save & Deploy Workflow" : "Deploy Workflow"}
              </>
            )}
          </Button>
        ) : (
          <Button
            disabled
            className="flex-1 bg-green-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Deployed Successfully
          </Button>
        )}
      </div>


    </div>;
};