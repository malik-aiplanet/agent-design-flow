import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCreateTeam } from "@/hooks/useTeams";
import { useInputs } from "@/hooks/useInputs";
import { useOutputs } from "@/hooks/useOutputs";
import { TeamCreateRequest } from "@/types/team";

interface DeployStepProps {
  data?: any;
  onUpdate?: (data: any) => void;
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
  isValid?: boolean;
}

export const DeployStep = ({
  data,
  onUpdate,
  hasUnsavedChanges,
  onSave,
  isValid
}: DeployStepProps) => {
  const [teamId, setTeamId] = useState<string | null>(data?.teamId || null);
  const navigate = useNavigate();

  // Hooks for workflow operations
  const createTeamMutation = useCreateTeam();
  // No separate deploy step - creating the team is the deployment

  // Fetch input and output data to display names properly
  const { data: inputsData } = useInputs();
  const { data: outputsData } = useOutputs();

  const inputs = inputsData?.items || [];
  const outputs = outputsData?.items || [];

  // Export handlers and state for parent component to use
  const deployStepActions = {
    handleCreateTeam: async () => {
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

        // Update parent data to indicate deployment is complete
        onUpdate?.({
          ...data,
          deploymentComplete: true,
          teamId: result.id
        });
      } catch (error) {
        console.error("Failed to create workflow:", error);
      }
    },
    handleTest: () => {
      // Navigate to chat interface for testing
      if (teamId) {
        navigate(`/chat/${teamId}`);
      } else {
        navigate("/chat/test");
      }
    },
    isCreating: createTeamMutation.isPending,
    isCreated: !!teamId,
    isDeployed: createTeamMutation.isSuccess // Creating IS deploying
  };

  // Move the onUpdate call to useEffect to prevent render-time state updates
  useEffect(() => {
    if (onUpdate && typeof onUpdate === 'function') {
      // Update the data with the actions so parent can access them
      const updatedData = { ...data, deployStepActions };
      if (JSON.stringify(updatedData.deployStepActions) !== JSON.stringify(data?.deployStepActions)) {
        onUpdate(updatedData);
      }
    }
  }, [onUpdate, data, deployStepActions]);

  const handleCreateTeam = deployStepActions.handleCreateTeam;
  const handleTest = deployStepActions.handleTest;
  const isCreating = deployStepActions.isCreating;
  const isCreated = deployStepActions.isCreated;
  const isDeployed = deployStepActions.isDeployed;

  const handleDeployTeam = async () => {
    // Since creating the team IS the deployment, just navigate to success
    if (teamId) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

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

                    {/* Input Components */}
          {data?.inputComponents && data.inputComponents.length > 0 && (() => {
            const configuredInputs = data.inputComponents
              .filter((inputComponent: any) => inputComponent.inputId && inputComponent.enabled)
              .map((inputComponent: any) => {
                const matchedInput = inputs.find(input => input.id === inputComponent.inputId);
                return matchedInput ? matchedInput.component.label : 'Unknown Input';
              });

            return configuredInputs.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Input Components</span>
                <p className="font-medium">{configuredInputs.join(', ')}</p>
              </div>
            );
          })()}

          {/* Output Components */}
          {(data?.selectedOutputId || data?.selectedOutputIds) && (() => {
            const selectedOutputId = data.selectedOutputId || data.selectedOutputIds?.[0];
            const selectedOutput = outputs.find(output => output.id === selectedOutputId);

            return selectedOutput && (
              <div>
                <span className="text-sm text-gray-500">Output Component</span>
                <p className="font-medium">{selectedOutput.component.label}</p>
              </div>
            );
          })()}

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

    </div>;
};