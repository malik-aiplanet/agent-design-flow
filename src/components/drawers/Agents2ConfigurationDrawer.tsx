import { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useModelConfigs, useAgentConfig, useCreateAgent, useUpdateAgent, useAgent } from "@/hooks/useAgents";
import { Agent2, AgentCreate, AgentUpdate, ModelConfig, AgentConfig } from "@/types/agent";
import { toast } from "@/hooks/use-toast";

interface Agents2ConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent2 | null;
}

export const Agents2ConfigurationDrawer = ({ isOpen, onClose, agent }: Agents2ConfigurationDrawerProps) => {
  const isEditMode = !!agent;

  // Hooks for fetching configs and mutations
  const { data: modelConfigs, isLoading: isLoadingModelConfigs } = useModelConfigs();
  const { data: agentConfig, isLoading: isLoadingAgentConfig } = useAgentConfig();
  const { data: fullAgentData, isLoading: isLoadingAgentData } = useAgent(agent?.id || '');
  const createAgentMutation = useCreateAgent();
  const updateAgentMutation = useUpdateAgent();

  // Form state with default values to prevent controlled/uncontrolled warnings
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedModelProvider: "",
    modelConfig: {} as Record<string, any>,
    systemMessage: "You are a helpful AI assistant.",
    reflectOnToolUse: false,
    streamModelClient: false,
    toolCallSummaryFormat: "{result}",
    metadata: {}
  });

    // Reset initial load flag when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsInitialLoad(true);
    }
  }, [isOpen]);

    // Initialize form data when agent or configs load
  useEffect(() => {
    if (agent && isEditMode && fullAgentData) {
      // Populate form with existing agent data from full backend response
      const component = fullAgentData.component;
      const config = component?.config;
      const modelClient = config?.model_client;

      setFormData({
        name: config?.name || "", // name is in component.config.name
        description: config?.description || "", // description is in component.config.description
        selectedModelProvider: modelClient?.provider || "",
        modelConfig: modelClient?.config || {},
        systemMessage: config?.system_message || "You are a helpful AI assistant.",
        reflectOnToolUse: config?.reflect_on_tool_use || false,
        streamModelClient: config?.model_client_stream || false,
        toolCallSummaryFormat: config?.tool_call_summary_format || "{result}",
        metadata: config?.metadata || {}
      });
    } else if (!isEditMode) {
      // Reset form for new agent
      setFormData({
        name: "",
        description: "",
        selectedModelProvider: "",
        modelConfig: {},
        systemMessage: "You are a helpful AI assistant.",
        reflectOnToolUse: false,
        streamModelClient: false,
        toolCallSummaryFormat: "{result}",
        metadata: {}
      });
    }
  }, [agent, isEditMode, fullAgentData]);

  // Track if this is the initial load to prevent overwriting existing config
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Update model config when provider changes
  useEffect(() => {
    if (formData.selectedModelProvider && modelConfigs) {
      const selectedModel = modelConfigs.find(m => m.provider === formData.selectedModelProvider);
      if (selectedModel && selectedModel.config) {
        // Only update if it's not the initial load (which would overwrite existing data)
        // or if we're creating a new agent
        if (!isInitialLoad || !isEditMode) {
          setFormData(prev => ({
            ...prev,
            modelConfig: { ...selectedModel.config }
          }));
        }
        setIsInitialLoad(false);
      }
    }
  }, [formData.selectedModelProvider, modelConfigs, isEditMode, isInitialLoad]);

  const handleModelConfigChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modelConfig: {
        ...(prev.modelConfig || {}),
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Agent name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.selectedModelProvider) {
      toast({
        title: "Validation Error",
        description: "Please select a model provider",
        variant: "destructive",
      });
      return;
    }

    if (!agentConfig || !modelConfigs) {
      toast({
        title: "Error",
        description: "Configuration not loaded",
        variant: "destructive",
      });
      return;
    }

    // Find the selected model config
    const selectedModel = modelConfigs.find(m => m.provider === formData.selectedModelProvider);
    if (!selectedModel) {
      toast({
        title: "Error",
        description: "Invalid model selection",
        variant: "destructive",
      });
      return;
    }

    // Create the component structure based on the template
    const component: AgentConfig = {
      ...agentConfig,
      config: {
        ...agentConfig.config,
        name: formData.name,
        description: formData.description,
        system_message: formData.systemMessage,
        model_client_stream: formData.streamModelClient,
        reflect_on_tool_use: formData.reflectOnToolUse,
        tool_call_summary_format: formData.toolCallSummaryFormat,
        metadata: formData.metadata,
        model_client: {
          ...selectedModel,
          config: formData.modelConfig
        }
      }
    };

    try {
      if (isEditMode && agent) {
        const updateData: AgentUpdate = {
          name: formData.name,
          description: formData.description,
          component,
          is_active: agent.status === "Active"
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
          component
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

  const renderModelConfigFields = () => {
    if (!formData.selectedModelProvider || !modelConfigs) return null;

    const selectedModel = modelConfigs.find(m => m.provider === formData.selectedModelProvider);
    if (!selectedModel) return null;

    return Object.entries(selectedModel.config).map(([key, defaultValue]) => {
      if (key === 'api_key' && typeof defaultValue === 'string' && defaultValue.includes('*')) {
        // Special handling for API keys
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</Label>
            <Input
              id={key}
              type="password"
              value={formData.modelConfig[key] ?? ''}
              onChange={(e) => handleModelConfigChange(key, e.target.value)}
              placeholder="Enter API key"
            />
          </div>
        );
      }

      if (typeof defaultValue === 'boolean') {
        return (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</Label>
            <Switch
              id={key}
              checked={formData.modelConfig[key] ?? defaultValue}
              onCheckedChange={(checked) => handleModelConfigChange(key, checked)}
            />
          </div>
        );
      }

      if (typeof defaultValue === 'number') {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</Label>
            <Input
              id={key}
              type="number"
              value={formData.modelConfig[key] ?? defaultValue}
              onChange={(e) => handleModelConfigChange(key, parseFloat(e.target.value) || 0)}
            />
          </div>
        );
      }

      // Default to text input
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</Label>
          <Input
            id={key}
            value={formData.modelConfig[key] ?? (defaultValue?.toString() || '')}
            onChange={(e) => handleModelConfigChange(key, e.target.value)}
          />
        </div>
      );
    });
  };

  if (!isOpen) return null;

  const isLoading = isLoadingModelConfigs || isLoadingAgentConfig || (isEditMode && isLoadingAgentData);
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

                    <div className="space-y-2">
                      <Label htmlFor="modelProvider">Model Provider <span className="text-red-500">*</span></Label>
                      <Select value={formData.selectedModelProvider} onValueChange={(value) => setFormData({...formData, selectedModelProvider: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {modelConfigs?.map((model) => (
                            <SelectItem key={model.provider} value={model.provider}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.selectedModelProvider && (
                      <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                        <h5 className="font-medium text-gray-800">Model Settings</h5>
                        {renderModelConfigFields()}
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
