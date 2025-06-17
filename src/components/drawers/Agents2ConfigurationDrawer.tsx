import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAgentConfig, useCreateAgent, useUpdateAgent, useAgent } from "@/hooks/useAgents";
import { useModels } from "@/hooks/useModels";
import { useTools } from "@/hooks/useTools";
import { toolsApi } from "@/api/tools";
import { Agent2, AgentCreate, AgentUpdate, AgentConfig } from "@/types/agent";
import { toast } from "@/hooks/use-toast";
import { modelsApi } from "@/api/models";

interface Agents2ConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent2 | null;
}

export const Agents2ConfigurationDrawer = ({ isOpen, onClose, agent }: Agents2ConfigurationDrawerProps) => {
  const isEditMode = !!agent;

  // Hooks for fetching configs and mutations
  const { data: agentConfig, isLoading: isLoadingAgentConfig } = useAgentConfig();
  const { data: fullAgentData, isLoading: isLoadingAgentData } = useAgent(agent?.id || '');

  // Fetch available tools
  const { data: toolsResponse, isLoading: isLoadingTools } = useTools({
    is_active: true,
    limit: 100
  });

  // Fetch user created models (private/models endpoint)
  const { data: modelsResponse, isLoading: isLoadingModels, error: modelsError } = useModels({ limit: 100 });
  const models = (modelsResponse as any)?.items || [];

  const availableTools = (toolsResponse as any)?.items || [];

  const createAgentMutation = useCreateAgent();
  const updateAgentMutation = useUpdateAgent();

  // Form state with default values to prevent controlled/uncontrolled warnings
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemMessage: "You are a helpful AI assistant.",
    reflectOnToolUse: false,
    streamModelClient: false,
    toolCallSummaryFormat: "{result}",
    metadata: {},
    selectedTools: [] as string[],
    selectedModelId: ""
  });

  // Initialize form data when agent or configs load
  useEffect(() => {
    if (agent && isEditMode && fullAgentData) {
      // Populate form with existing agent data from full backend response
      const component = fullAgentData.component;
      const config = component?.config;
      const workbench = config?.workbench;

      // Try to get model_id from fullAgentData (backend should return it)
      // Fallback to empty string if not present
      const existingModelId = (fullAgentData as any)?.model_id || "";

      // Extract selected tool IDs from workbench config
      const selectedToolIds = workbench?.config?.tools?.map((tool: any) => tool.id) || [];

      setFormData({
        name: config?.name || "", // name is in component.config.name
        description: config?.description || "", // description is in component.config.description
        systemMessage: config?.system_message || "You are a helpful AI assistant.",
        reflectOnToolUse: config?.reflect_on_tool_use || false,
        streamModelClient: config?.model_client_stream || false,
        toolCallSummaryFormat: config?.tool_call_summary_format || "{result}",
        metadata: config?.metadata || {},
        selectedTools: selectedToolIds,
        selectedModelId: existingModelId
      });
    } else if (!isEditMode) {
      // Reset form for new agent
      setFormData({
        name: "",
        description: "",
        systemMessage: "You are a helpful AI assistant.",
        reflectOnToolUse: false,
        streamModelClient: false,
        toolCallSummaryFormat: "{result}",
        metadata: {},
        selectedTools: [],
        selectedModelId: ""
      });
    }
  }, [agent, isEditMode, fullAgentData]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Agent name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.selectedModelId) {
      toast({
        title: "Validation Error",
        description: "Please select a model",
        variant: "destructive",
      });
      return;
    }

    if (!agentConfig) {
      toast({
        title: "Error",
        description: "Configuration not loaded",
        variant: "destructive",
      });
      return;
    }

    // Fetch the selected model component
    let selectedModelComponent: any = null;
    try {
      const modelData = await modelsApi.getById(formData.selectedModelId);
      selectedModelComponent = modelData.component;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load selected model details",
        variant: "destructive",
      });
      return;
    }

    // Build the selected tools array from available tools
    // We need to fetch full tool data for each selected tool to get the complete component structure
    let selectedToolComponents = [];

    if (formData.selectedTools.length > 0) {
      try {
        // Fetch full data for each selected tool using the API service
        const toolPromises = formData.selectedTools.map(async (toolId) => {
          try {
            const toolData = await toolsApi.getById(toolId);
            return toolData.component; // Return just the component part
          } catch (error) {
            console.warn(`Error fetching tool ${toolId}:`, error);
            return null;
          }
        });

        selectedToolComponents = (await Promise.all(toolPromises)).filter(Boolean);
      } catch (error) {
        console.error('Error fetching tool components:', error);
        toast({
          title: "Warning",
          description: "Some tools could not be loaded. Agent will be created without tools.",
          variant: "destructive",
        });
        selectedToolComponents = [];
      }
    }

    // Create the component structure based on the template
    // agentConfig is an array from the backend, use the first component (AssistantAgent)
    const templateComponent = Array.isArray(agentConfig) ? agentConfig[0] : agentConfig;

    const component: AgentConfig = {
      ...templateComponent,
      config: {
        ...templateComponent.config,
        name: formData.name,
        description: formData.description,
        system_message: formData.systemMessage,
        model_client_stream: formData.streamModelClient,
        reflect_on_tool_use: formData.reflectOnToolUse,
        tool_call_summary_format: formData.toolCallSummaryFormat,
        metadata: formData.metadata,
        model_client: selectedModelComponent,
        workbench: {
          ...templateComponent.config.workbench,
          config: {
            ...templateComponent.config.workbench.config,
            tools: selectedToolComponents
          }
        }
      }
    };

    try {
      if (isEditMode && agent) {
        const updateData: AgentUpdate = {
          name: formData.name,
          description: formData.description,
          component,
          is_active: agent.status === "Active",
          model_id: formData.selectedModelId || undefined,
          tool_ids: formData.selectedTools.length ? formData.selectedTools : undefined
        };

        await updateAgentMutation.mutateAsync({ id: agent.id, data: updateData });
        toast({
          title: "Success",
          description: "Agent updated successfully",
        });
      } else {
        const createData: AgentCreate = {
          name: formData.name,
          description: formData.description,
          component,
          model_id: formData.selectedModelId || undefined,
          tool_ids: formData.selectedTools.length ? formData.selectedTools : undefined
        };

        await createAgentMutation.mutateAsync(createData);
        toast({
          title: "Success",
          description: "Agent created successfully",
        });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save agent",
        variant: "destructive",
      });
    }
  };

  const handleToolToggle = (toolId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(toolId)
        ? prev.selectedTools.filter(id => id !== toolId)
        : [...prev.selectedTools, toolId]
    }));
  };

  // Handler for when user selects a model from their own list
  const handleUserModelSelect = (modelId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedModelId: modelId
    }));
  };

  if (!isOpen) return null;

  const isLoading = isLoadingAgentConfig || isLoadingTools || isLoadingModels || (isEditMode && isLoadingAgentData);
  const isSaving = createAgentMutation.isPending || updateAgentMutation.isPending;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-1/2 min-w-[600px] max-w-[900px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditMode ? "Edit Agent" : "Create New Agent"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode ? "Configure agent settings and behavior" : "Create a new AI agent with dynamic model configuration"}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span className="text-slate-600">Loading configuration...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-lg">Basic Information</h4>

                    <div className="space-y-2">
                      <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter agent name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter agent description"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Model Configuration */}
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 text-lg">Model Configuration</h4>

                    {/* User Model selection */}
                    <div className="space-y-2">
                      <Label htmlFor="userModel">Model <span className="text-red-500">*</span></Label>
                      {isLoadingModels && (
                        <div className="flex items-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                          <span className="text-sm text-gray-600">Loading models...</span>
                        </div>
                      )}
                      {modelsError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                          <span className="text-xs text-red-700">Failed to load models</span>
                        </div>
                      )}
                      {!isLoadingModels && !modelsError && (
                        <Select value={formData.selectedModelId} onValueChange={handleUserModelSelect} key={`model-select-${formData.selectedModelId}`}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map((model: any) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{model.name}</span>
                                  <span className="text-xs text-gray-500">{model.modelId}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* Tools Selection */}
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 text-lg">Tools</h4>
                      <Badge variant="secondary" className="text-xs">
                        {formData.selectedTools.length} selected
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Select the tools that your agent will have access to during conversations.
                    </p>

                    {availableTools.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                        {availableTools.map((tool) => (
                          <Card key={tool.id} className="hover:bg-gray-50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  checked={formData.selectedTools.includes(tool.id)}
                                  onCheckedChange={() => handleToolToggle(tool.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-gray-900 text-sm">{tool.name}</h5>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${tool.status === 'Active' ? 'border-green-200 text-green-700' : 'border-gray-200 text-gray-700'}`}
                                    >
                                      {tool.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-2">{tool.description}</p>
                                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                    <span className="font-medium">Provider:</span>
                                    <span className="truncate">{tool.provider}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No tools available</p>
                        <p className="text-xs mt-1">Create some tools first to add them to your agent</p>
                      </div>
                    )}
                  </div>

                  {/* Agent Behavior */}
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 text-lg">Agent Behavior</h4>

                    <div className="space-y-2">
                      <Label htmlFor="systemMessage">System Message</Label>
                      <Textarea
                        id="systemMessage"
                        value={formData.systemMessage}
                        onChange={(e) => setFormData({...formData, systemMessage: e.target.value})}
                        placeholder="Define the agent's behavior and role"
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toolCallSummaryFormat">Tool Call Summary Format</Label>
                      <Input
                        id="toolCallSummaryFormat"
                        value={formData.toolCallSummaryFormat}
                        onChange={(e) => setFormData({...formData, toolCallSummaryFormat: e.target.value})}
                        placeholder="{result}"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reflectOnToolUse" className="text-base font-medium">
                          Reflect on Tool Use
                        </Label>
                        <p className="text-sm text-gray-500">Allow agent to reflect on tool usage</p>
                      </div>
                      <Switch
                        id="reflectOnToolUse"
                        checked={formData.reflectOnToolUse}
                        onCheckedChange={(checked) => setFormData({...formData, reflectOnToolUse: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="streamModelClient" className="text-base font-medium">
                          Stream Model Client
                        </Label>
                        <p className="text-sm text-gray-500">Enable streaming responses</p>
                      </div>
                      <Switch
                        id="streamModelClient"
                        checked={formData.streamModelClient}
                        onCheckedChange={(checked) => setFormData({...formData, streamModelClient: checked})}
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditMode ? 'Update Agent' : 'Create Agent'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
