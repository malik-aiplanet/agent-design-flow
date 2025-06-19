import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, User, Users, Settings, Rocket, ArrowUpDown, Loader2, CheckCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useTeam, useUpdateTeam, useDeployTeam, useUndeployTeam, useTestTeam } from "@/hooks/useTeams";
import { TeamResponse, TeamUpdate, TeamComponent } from "@/types/team";
import { useToast } from "@/hooks/use-toast";
import { transformAgentsToParticipants } from "@/lib/teamUtils";

// Import all step components
import { teamDetailsStep } from "@/components/steps/TeamDetailsStep";
import { SubAgentsStep } from "@/components/steps/SubAgentsStep";
import { IOStep } from "@/components/steps/IOStep";
import { TeamStep } from "@/components/steps/TeamStep";
import { DeployStep } from "@/components/steps/DeployStep";

const steps = [
  { id: 1, title: "Workflow Details", component: teamDetailsStep, icon: User },
  { id: 2, title: "Sub Agents", component: SubAgentsStep, icon: Users },
  { id: 3, title: "IO", component: IOStep, icon: ArrowUpDown },
  { id: 4, title: "Configuration", component: TeamStep, icon: Settings },
  { id: 5, title: "Deploy", component: DeployStep, icon: Rocket },
];

// Mock data for existing agent (fallback)
const mockAgentData = {
  name: "Customer Support Agent",
  description: "Handles customer inquiries and support tickets with intelligent routing and escalation",
  model: "GPT-4",
  status: "Active",
  tools: ["task-actions", "media"],
  systemPrompt: "You are a helpful customer support agent..."
};

// Transform workflow state back to TeamUpdate format for API
const transformWorkflowStateToTeamUpdate = async (workflowState: any, originalTeam: TeamResponse): Promise<TeamUpdate> => {
  const config = { ...originalTeam.component.config };

  // Update basic team configuration
  if (workflowState.teamConfig) {
    Object.assign(config, workflowState.teamConfig);
  }

  // Use actual selected agents instead of customAgents from template
  if (workflowState.selectedAgents && workflowState.selectedAgents.length > 0) {
    // Use cached participants data if available, otherwise fetch from API
    const participants = workflowState.participantsData || await transformAgentsToParticipants(workflowState.selectedAgents);
    config.participants = participants;
  }

  // Create the updated component
  const updatedComponent: TeamComponent = {
    ...originalTeam.component,
    label: workflowState.name || originalTeam.component.label,
    description: workflowState.description || originalTeam.component.description,
    config: config
  };

  return {
    component: updatedComponent,
    organization_id: originalTeam.organization_id,
    // Include related IDs if they exist in the workflow state
    model_id: workflowState.selectedModelId || (originalTeam as any).model_id,
    team_agent_ids: workflowState.selectedAgents || (originalTeam as any).team_agent_ids || [],
    team_input_ids: workflowState.team_input_ids || (originalTeam as any).team_input_ids || [],
    team_output_ids: workflowState.team_output_ids || (originalTeam as any).team_output_ids || [],
    team_termination_condition_ids: workflowState.selectedTerminationIds || (originalTeam as any).team_termination_condition_ids || []
  };
};

// Transform TeamResponse to workflow state format
const transformTeamToWorkflowState = (teamResponse: TeamResponse) => {
  const component = teamResponse.component;
  const config = component.config;

  // Extract team type from provider (e.g., "autogen_agentchat.teams.SelectorGroupChat" -> "SelectorGroupChat")
  const teamType = component.provider?.split('.').pop() || '';

  // Extract model client information for SelectorGroupChat
  let selectedModelId = '';
  let selectedModel = null;

  // First check if there's a model_id at the team level (this is the ID we want)
  if ((teamResponse as any).model_id) {
    selectedModelId = (teamResponse as any).model_id;
  } else if (config.model_client) {
    // Fallback: try to extract from model_client config, but this might be the model name, not ID
    selectedModelId = config.model_client.config?.model || '';
  }

  if (selectedModelId) {
    selectedModel = {
      modelId: selectedModelId,
      // Add other model properties as needed
    };
  }

  return {
    // Step 1: Workflow Details
    name: component.label,
    description: component.description,
    teamType: teamType,

    // Step 2: Sub Agents
    selectedAgents: (teamResponse as any).team_agent_ids || [],
    customAgents: config.participants || [],

        // Step 3: IO Configuration
    selectedInputIds: (teamResponse as any).team_input_ids || [],
    selectedOutputIds: (teamResponse as any).team_output_ids || [],
    team_input_ids: (teamResponse as any).team_input_ids || [],
    team_output_ids: (teamResponse as any).team_output_ids || [],
    // Create inputComponents structure expected by IOStep
    inputComponents: ((teamResponse as any).team_input_ids || []).length > 0
      ? ((teamResponse as any).team_input_ids || []).map((inputId: string, index: number) => ({
          id: `input-${index + 1}`,
          inputId: inputId,
          enabled: true
        }))
      : [{ id: "1", inputId: "", enabled: true }], // Default empty input component
    // Single output selection for IOStep
    selectedOutputId: ((teamResponse as any).team_output_ids || [])[0] || null,

    // Step 4: Team Configuration
    selectedTeamType: teamType,
    teamConfig: {
      ...config,
      // Ensure all required fields are present
      max_turns: config.max_turns || 10,
      emit_team_events: config.emit_team_events || false,
      participants: config.participants || [],
      // SelectorGroupChat specific fields
      ...(teamType === 'SelectorGroupChat' && {
        selector_prompt: config.selector_prompt || "You are in a role play game...",
        allow_repeated_speaker: config.allow_repeated_speaker || false,
        max_selector_attempts: config.max_selector_attempts || 3,
        model_client_streaming: config.model_client_streaming || false,
        model_client: config.model_client
      }),
      // Add termination condition ID if present
      ...(((teamResponse as any).team_termination_condition_ids?.length > 0) && {
        termination_condition: ((teamResponse as any).team_termination_condition_ids)[0]
      })
    },
    selectedTeamTemplate: {
      provider: component.provider,
      component_type: component.component_type,
      version: component.version,
      component_version: component.component_version,
      description: component.description,
      label: teamType,
      config: config
    },

    // Model selection for SelectorGroupChat
    ...(selectedModelId && {
      selectedModelId,
      selectedModel
    }),

    // Step 5: Deploy
    teamId: teamResponse.id,
    deploymentComplete: false,

    // Additional metadata
    organizationId: teamResponse.organization_id,
    createdAt: teamResponse.created_at,
    updatedAt: teamResponse.updated_at,
    isDeleted: teamResponse.is_deleted,

    // Include termination conditions if present
    ...(((teamResponse as any).team_termination_condition_ids) && {
      selectedTerminationIds: (teamResponse as any).team_termination_condition_ids
    })
  };
};

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch complete team data from backend
  const { data: teamResponse, isLoading, error } = useTeam(id!);

  // Update team mutation
  const updateTeamMutation = useUpdateTeam();

  // Deploy mutations
  const deployTeamMutation = useDeployTeam();
  const undeployTeamMutation = useUndeployTeam();
  const testTeamMutation = useTestTeam();

  // Toast for notifications
  const { toast } = useToast();

  // Get team data from router state as fallback for display name
  const routerTeamData = location.state?.teamData;

  // Transform backend data to workflow state format
  const [agentData, setAgentData] = useState<any>({});

  // Deploy step actions similar to CreateTeam.tsx
  const handleDeploy = useCallback(async () => {
    if (!id) return;

    try {
      await deployTeamMutation.mutateAsync(id);
      setIsDeployed(true);

      // Update agent data to indicate deployment is complete
      setAgentData((prev: any) => ({
        ...prev,
        isDeployed: true,
        deploymentComplete: true
      }));

      toast({
        title: "Team Deployed",
        description: "Your team has been successfully deployed.",
      });
    } catch (error) {
      console.error("Failed to deploy team:", error);
      toast({
        title: "Deployment Failed",
        description: "There was an error deploying your team. Please try again.",
        variant: "destructive",
      });
    }
  }, [id, deployTeamMutation, toast]);

  const handleUndeploy = useCallback(async () => {
    if (!id) return;

    try {
      await undeployTeamMutation.mutateAsync(id);
      setIsDeployed(false);

      setAgentData((prev: any) => ({
        ...prev,
        isDeployed: false,
        deploymentComplete: false
      }));

      toast({
        title: "Team Undeployed",
        description: "Your team has been undeployed.",
      });
    } catch (error) {
      console.error("Failed to undeploy team:", error);
      toast({
        title: "Undeploy Failed",
        description: "There was an error undeploying your team. Please try again.",
        variant: "destructive",
      });
    }
  }, [id, undeployTeamMutation, toast]);

  const handleTest = useCallback(async () => {
    if (!id) return;

    try {
      const testData = {
        test_input: agentData?.testInput || "Hello, test the workflow",
        max_iterations: 5,
        timeout: 30000
      };

      const result = await testTeamMutation.mutateAsync({ id: id, testData });

      // Navigate to chat interface with test results
      navigate(`/chat/${id}`, {
        state: {
          testMode: true,
          testResult: result
        }
      });
    } catch (error) {
      console.error("Failed to test team:", error);
      toast({
        title: "Test Failed",
        description: "There was an error testing your team. Please try again.",
        variant: "destructive",
      });
    }
  }, [id, testTeamMutation, navigate, toast, agentData?.testInput]);

  const deployStepActions = {
    handleDeploy,
    handleUndeploy,
    handleTest,
    // State getters
    isCreating: false, // Not applicable in edit mode
    isCreated: !!id, // Team already exists
    isDeploying: deployTeamMutation.isPending,
    isDeployed: isDeployed,
    isUndeploying: undeployTeamMutation.isPending,
    isTesting: testTeamMutation.isPending,
    deploymentStatus: isDeployed ? 'deployed' : 'idle'
  };

  useEffect(() => {
    if (teamResponse) {
      console.log("Full team data from backend:", teamResponse);
      const transformedData = transformTeamToWorkflowState(teamResponse);
      console.log("Transformed workflow data:", transformedData);
      console.log("Input components structure:", transformedData.inputComponents);
      console.log("Selected output ID:", transformedData.selectedOutputId);
      console.log("Selected agents:", transformedData.selectedAgents);

      // Set deployment status based on team data
      const isTeamDeployed = (teamResponse as any).is_deployed || false;
      setIsDeployed(isTeamDeployed);

      // Add deployStepActions to the transformed data
      setAgentData({
        ...transformedData,
        isDeployed: isTeamDeployed,
        deployStepActions
      });
    } else if (routerTeamData && !isLoading) {
      // Fallback to router data if backend fetch fails, but convert to expected format
      const fallbackData = {
        name: routerTeamData.name,
        description: routerTeamData.description,
        teamType: routerTeamData.teamType,
        status: routerTeamData.status,
        participantsCount: routerTeamData.participantsCount,
        maxTurns: routerTeamData.maxTurns,
        lastModified: routerTeamData.lastModified,
        teamId: routerTeamData.id,
        // Add default empty structures for fallback
        inputComponents: [{ id: "1", inputId: "", enabled: true }],
        selectedOutputId: null,
        selectedAgents: [],
        isDeployed: false,
        deployStepActions
      };
      console.log("Using fallback router data:", fallbackData);
      setAgentData(fallbackData);
    }
  }, [teamResponse, routerTeamData, isLoading]);



  useEffect(() => {
    console.log("Editing team with ID:", id);
    console.log("Router team data:", routerTeamData);
    console.log("Backend team response:", teamResponse);
  }, [id, routerTeamData, teamResponse]);

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  // Show error state if team not found
  if (error || (!teamResponse && !routerTeamData)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load team data</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const updateAgentData = (newData: any, markUnsaved: boolean = true) => {
    setAgentData((prev: any) => ({
      ...prev,
      ...newData,
      deployStepActions
    }));
    if (markUnsaved) {
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = async () => {
    if (!teamResponse || !id) {
      console.error("No team data available for update");
      return;
    }

    try {
      console.log("Saving agent data:", agentData);

      // Transform the workflow state back to the API format
      const updateData = await transformWorkflowStateToTeamUpdate(agentData, teamResponse);
      console.log("Update payload:", updateData);

      // Make the API call to update the team
      await updateTeamMutation.mutateAsync({
        id: id,
        data: updateData
      });

      console.log("Team updated successfully");

      // Show success toast
      toast({
        title: "Team Updated",
        description: "Your team has been successfully updated.",
      });

      // Reset unsaved changes
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to update team:", error);

      // Show error toast
      toast({
        title: "Update Failed",
        description: "There was an error updating your team. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get display name from available data
  const displayName = agentData.name || routerTeamData?.name || "Unknown Team";

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 flex pb-20">
      {/* Vertical Step Sidebar - Made Sticky */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="max-w-[160px]">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  Edit Workflow
                </h1>
                <p className="text-sm text-gray-500 truncate">
                  {displayName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const IconComponent = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted
                      ? "bg-green-100 border-green-500"
                      : isActive
                      ? "bg-white border-white"
                      : "border-gray-300"
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <IconComponent className={`h-4 w-4 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      isActive ? "text-white" : isCompleted ? "text-green-700" : "text-gray-700"
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs ${
                      isActive ? "text-blue-100" : isCompleted ? "text-green-600" : "text-gray-500"
                    }`}>
                      Step {step.id} of {steps.length}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <CurrentStepComponent
                data={agentData}
                onUpdate={updateAgentData}
                onNext={nextStep}
                onPrev={prevStep}
                onSave={handleSave}
                hasUnsavedChanges={hasUnsavedChanges}
                isEditMode={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-2 h-10 text-sm border-gray-300"
          >
            Cancel
          </Button>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-2 h-10 text-sm disabled:opacity-50 border-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <>
                {/* Deploy Step - Button sequence: Save Changes → Deploy → Test */}

                {/* Save Changes Button */}
                {hasUnsavedChanges ? (
                  <Button
                    onClick={handleSave}
                    disabled={updateTeamMutation.isPending}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm disabled:opacity-50"
                  >
                    {updateTeamMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 px-6 py-2 h-10 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Changes saved
                  </div>
                )}

                {/* Deploy Button - Available after save */}
                {!hasUnsavedChanges && !agentData?.deployStepActions?.isDeployed && (
                  <Button
                    onClick={() => agentData?.deployStepActions?.handleDeploy()}
                    disabled={agentData?.deployStepActions?.isDeploying}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm disabled:opacity-50"
                  >
                    {agentData?.deployStepActions?.isDeploying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" />
                        Deploy
                      </>
                    )}
                  </Button>
                )}

                {/* Deployed Status */}
                {agentData?.deployStepActions?.isDeployed && (
                  <div className="flex items-center gap-2 px-6 py-2 h-10 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Deployed
                  </div>
                )}

                {/* Test Button - Available after deployment */}
                {agentData?.deployStepActions?.isDeployed && (
                  <Button
                    variant="outline"
                    onClick={() => agentData?.deployStepActions?.handleTest()}
                    disabled={agentData?.deployStepActions?.isTesting}
                    className="flex items-center gap-2 px-6 py-2 h-10 text-sm disabled:opacity-50"
                  >
                    {agentData?.deployStepActions?.isTesting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Wrench className="h-4 w-4" />
                        Run Test
                      </>
                    )}
                  </Button>
                )}

              </>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTeam;
