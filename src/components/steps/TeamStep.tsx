import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { buildersApi } from "@/api/builders";
import { TeamComponent, TEAM_TYPE_INFO } from "@/types/team";
import { getTeamTypeIcon } from "@/lib/teamUtils";
import { useTerminations } from "@/hooks/useTerminations";
import { ModelSelectionCard } from "./team/ModelSelectionCard";

interface TeamStepProps {
  data?: {
    teamType?: string; // This comes from step 1 (e.g., "RoundRobinGroupChat")
    teamConfig?: any;
    selectedTeamTemplate?: TeamComponent;
    selectedModelId?: string;
    [key: string]: any;
  };
  onUpdate?: (data: any) => void;
  isValid?: boolean;
}

export const TeamStep = ({
  data,
  onUpdate,
  isValid
}: TeamStepProps) => {
  const [teamConfigs, setTeamConfigs] = useState<TeamComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<TeamComponent | null>(null);

  // Fetch user-created termination conditions
  const { data: terminationsResponse, isLoading: terminationsLoading } = useTerminations({ limit: 100 });
  const terminations = terminationsResponse?.items || [];

  // Fetch team configurations and find the template for selected team type
  useEffect(() => {
    const fetchTeamConfigs = async () => {
      try {
        setLoading(true);
        const configs = await buildersApi.getTeamConfigs();
        setTeamConfigs(configs);

        // Find the template for the selected team type from step 1
        if (data?.teamType) {
          const template = configs.find(config => config.label === data.teamType);
          if (template) {
            setSelectedTemplate(template);
            // Initialize team config if not already set
            if (!data?.teamConfig) {
              handleUpdate({
                selectedTeamTemplate: template,
                teamConfig: { ...template.config }
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch team configs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamConfigs();
  }, [data?.teamType]);

  const handleUpdate = (newData: any) => {
    onUpdate?.({
      ...data,
      ...newData,
    });
  };

  const handleConfigUpdate = (field: string, value: any) => {
    const updatedConfig = {
      ...data?.teamConfig,
      [field]: value
    };
    handleUpdate({ teamConfig: updatedConfig });
  };

  const renderTeamTypeHeader = () => {
    if (!selectedTemplate) return null;

    const typeInfo = TEAM_TYPE_INFO[selectedTemplate.provider as keyof typeof TEAM_TYPE_INFO];
    const IconComponent = getTeamTypeIcon(selectedTemplate.label);

    return (
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {typeInfo?.name || selectedTemplate.label} Configuration
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {typeInfo?.description || selectedTemplate.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500">Selected in Step 1</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderBasicConfiguration = () => {
    const config = data?.teamConfig || selectedTemplate?.config || {};

    return (
      <Card>
        <CardHeader>
          <CardTitle>Basic Configuration</CardTitle>
          <p className="text-sm text-gray-600">
            Core settings that control how your workflow operates
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxTurns">Maximum Turns</Label>
            <Input
              id="maxTurns"
              type="number"
              value={config?.max_turns || 10}
              onChange={(e) => handleConfigUpdate('max_turns', parseInt(e.target.value) || 10)}
              min={1}
              max={100}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum number of conversation turns before the workflow stops
            </p>
          </div>

          <div>
            <Label htmlFor="terminationCondition">Termination Condition</Label>
            {terminationsLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">Loading conditions...</span>
              </div>
            ) : (
              <Select
                value={config?.termination_condition || ""}
                onValueChange={(value) => handleConfigUpdate('termination_condition', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select termination condition" />
                </SelectTrigger>
                <SelectContent>
                  {terminations.map((termination) => (
                    <SelectItem key={termination.id} value={termination.id}>
                      {termination.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Define when the conversation should end
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="emitTeamEvents"
              checked={config?.emit_team_events || false}
              onCheckedChange={(checked) => handleConfigUpdate('emit_team_events', checked)}
            />
            <Label htmlFor="emitTeamEvents" className="text-sm font-medium">
              Emit Team Events
            </Label>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Enable detailed event tracking for monitoring and debugging
          </p>
        </CardContent>
      </Card>
    );
  };

  const renderSelectorConfiguration = () => {
    if (!selectedTemplate || selectedTemplate.provider !== "autogen_agentchat.teams.SelectorGroupChat") {
      return null;
    }

    const config = data?.teamConfig || selectedTemplate.config;

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Selector Configuration</CardTitle>
            <p className="text-sm text-gray-600">
              Configure how the AI selects the next speaker in conversations
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="selectorPrompt">Selector Prompt</Label>
              <Textarea
                id="selectorPrompt"
                value={config?.selector_prompt || "You are in a role play game..."}
                onChange={(e) => handleConfigUpdate('selector_prompt', e.target.value)}
                placeholder="Enter the prompt for selecting the next speaker..."
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Instructions that guide the AI in selecting which agent should speak next
              </p>
            </div>

            <div>
              <Label htmlFor="maxSelectorAttempts">Max Selector Attempts</Label>
              <Input
                id="maxSelectorAttempts"
                type="number"
                value={config?.max_selector_attempts || 3}
                onChange={(e) => handleConfigUpdate('max_selector_attempts', parseInt(e.target.value) || 3)}
                min={1}
                max={10}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of times to retry if speaker selection fails
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowRepeatedSpeaker"
                  checked={config?.allow_repeated_speaker || false}
                  onCheckedChange={(checked) => handleConfigUpdate('allow_repeated_speaker', checked)}
                />
                <Label htmlFor="allowRepeatedSpeaker" className="text-sm font-medium">
                  Allow Repeated Speaker
                </Label>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                Allow the same agent to speak multiple times in a row
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="modelClientStreaming"
                  checked={config?.model_client_streaming || false}
                  onCheckedChange={(checked) => handleConfigUpdate('model_client_streaming', checked)}
                />
                <Label htmlFor="modelClientStreaming" className="text-sm font-medium">
                  Enable Model Client Streaming
                </Label>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                Stream responses from the model for real-time interaction
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Model Selection for SelectorGroupChat */}
        <ModelSelectionCard
          selectedModelId={data?.selectedModelId}
                    onUpdate={(modelData) => {
            // Combine both the model selection and team config update into a single update
            const updatedData: any = { ...modelData };

            if (modelData.selectedModel) {
              const updatedConfig = {
                ...data?.teamConfig,
                model_client: {
                  provider: "autogen_ext.models.openai.OpenAIChatCompletionClient",
                  component_type: "model",
                  version: 1,
                  component_version: 1,
                  description: "Chat completion client for OpenAI hosted models.",
                  label: "OpenAIChatCompletionClient",
                  config: {
                    model: modelData.selectedModel.modelId,
                    api_key: "**********"
                  }
                }
              };
              updatedData.teamConfig = updatedConfig;
            }

            handleUpdate(updatedData);
          }}
        />
      </>
    );
  };

  const renderRoundRobinConfiguration = () => {
    if (!selectedTemplate || selectedTemplate.provider !== "autogen_agentchat.teams.RoundRobinGroupChat") {
      return null;
    }

    return (
      <Card className="border border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs font-bold">✓</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-green-800">Round Robin Configuration</h4>
              <p className="text-xs text-green-700">
                Round Robin teams use a simple turn-based approach. Agents will speak in the order they were added in Step 2. No additional AI selection configuration is needed.
              </p>
              <ul className="text-xs text-green-700 mt-2 space-y-1">
                <li>• Agents speak in predetermined order</li>
                <li>• No AI model needed for speaker selection</li>
                <li>• Predictable conversation flow</li>
                <li>• Best for structured, sequential workflows</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSwarmConfiguration = () => {
    if (!selectedTemplate || selectedTemplate.provider !== "autogen_agentchat.teams.Swarm") {
      return null;
    }

    return (
      <Card className="border border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-600 text-xs font-bold">⚡</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-yellow-800">Swarm Configuration</h4>
              <p className="text-xs text-yellow-700">
                Swarm teams coordinate through handoff messages between agents. Agents can autonomously transfer control to other agents based on their handoff configurations.
              </p>
              <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                <li>• Agents coordinate through handoff messages</li>
                <li>• Dynamic speaker selection based on agent decisions</li>
                <li>• Configure handoffs in individual agents</li>
                <li>• Best for autonomous, flexible workflows</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderConfigurationSummary = () => {
    const config = data?.teamConfig || selectedTemplate?.config || {};
    const typeInfo = TEAM_TYPE_INFO[selectedTemplate?.provider as keyof typeof TEAM_TYPE_INFO];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Team Type:</span>
                <span className="ml-2">{typeInfo?.name || selectedTemplate?.label}</span>
              </div>
              <div>
                <span className="font-medium">Max Turns:</span>
                <span className="ml-2">{config?.max_turns || 10}</span>
              </div>
              <div>
                <span className="font-medium">Team Events:</span>
                <span className="ml-2">{config?.emit_team_events ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div>
                <span className="font-medium">Participants:</span>
                <span className="ml-2">{config?.participants?.length || 'To be added in Step 2'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">Team Configuration</h3>
          <p className="text-gray-600 text-lg">Loading team configuration...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Setting up configuration for your selected team type...</span>
        </div>
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">Team Configuration</h3>
          <p className="text-gray-600 text-lg">Configure your team settings and parameters.</p>
        </div>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Team Type Not Selected</h3>
            <p className="text-red-700">
              Please go back to Step 1 and select a workflow type before configuring team settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">Team Configuration</h3>
        <p className="text-gray-600 text-lg">
          Configure settings and parameters for your {TEAM_TYPE_INFO[selectedTemplate.provider as keyof typeof TEAM_TYPE_INFO]?.name || selectedTemplate.label} workflow.
        </p>
      </div>

      {/* Team Type Header */}
      {renderTeamTypeHeader()}

      {/* Basic Configuration - All team types need this */}
      {renderBasicConfiguration()}

      {/* Team Type Specific Configuration */}
      {renderRoundRobinConfiguration()}
      {renderSelectorConfiguration()}
      {renderSwarmConfiguration()}

      {/* Configuration Summary */}
      {renderConfigurationSummary()}

      {/* Validation Status */}
      {!isValid && selectedTemplate && (
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-800">Configuration Required</h4>
                <p className="text-xs text-red-700">
                  {selectedTemplate.provider === "autogen_agentchat.teams.SelectorGroupChat"
                    ? "Please select a model for the SelectorGroupChat to continue."
                    : "Please complete the required configuration fields."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
