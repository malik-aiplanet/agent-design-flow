
import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTerminationConditionConfigs, useCreateTermination, useUpdateTermination } from "@/hooks/useTerminations";
import { Termination2, TerminationConditionComponent } from "@/types/termination";
import { toast } from "sonner";

interface TerminationConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  termination: Termination2 | null;
}

export const TerminationConfigurationDrawer = ({ isOpen, onClose, termination }: TerminationConfigurationDrawerProps) => {
  const [selectedConfigType, setSelectedConfigType] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    terminationText: "",
    maxMessages: 10,
    includeAgentEvent: false,
    timeout: 1000,
    functionName: "",
    target: "",
    maxTotalToken: 100,
    maxPromptToken: 100,
    maxCompletionToken: 100,
    source: "",
    sources: ""
  });

  // Load available termination condition configurations
  const { data: terminationConfigs, isLoading: configsLoading } = useTerminationConditionConfigs();

  // Mutations
  const createMutation = useCreateTermination();
  const updateMutation = useUpdateTermination();

  const isEditing = !!termination;

  // Initialize form data when termination changes
  useEffect(() => {
    if (termination) {
      const config = termination.config || {};
      setFormData({
        name: termination.name || "",
        description: termination.description || "",
        terminationText: config.text || "",
        maxMessages: config.max_messages || 10,
        includeAgentEvent: config.include_agent_event || false,
        timeout: config.timeout_seconds || 1000,
        functionName: config.function_name || "",
        target: config.target || "",
        maxTotalToken: config.max_total_token || 100,
        maxPromptToken: config.max_prompt_token || 100,
        maxCompletionToken: config.max_completion_token || 100,
        source: config.source || "",
        sources: Array.isArray(config.sources) ? config.sources.join(", ") : ""
      });
      setSelectedConfigType(termination.component?.label || "");
    } else {
      // Reset form for new termination
      setFormData({
        name: "",
        description: "",
        terminationText: "",
        maxMessages: 10,
        includeAgentEvent: false,
        timeout: 1000,
        functionName: "",
        target: "",
        maxTotalToken: 100,
        maxPromptToken: 100,
        maxCompletionToken: 100,
        source: "",
        sources: ""
      });
      setSelectedConfigType("");
    }
  }, [termination]);

  const getSelectedConfig = (): TerminationConditionComponent | null => {
    if (!terminationConfigs || !selectedConfigType) return null;
    return terminationConfigs.find(config => config.label === selectedConfigType) || null;
  };

  const buildComponentData = () => {
    const selectedConfig = getSelectedConfig();
    if (!selectedConfig) return null;

    // Build config based on termination type
    let config: Record<string, any> = {
      name: formData.name,
      description: formData.description
    };

    switch (selectedConfig.label) {
      case "TextMentionTermination":
        config.text = formData.terminationText;
        break;
      case "MaxMessageTermination":
        config.max_messages = formData.maxMessages;
        config.include_agent_event = formData.includeAgentEvent;
        break;
      case "TimeoutTermination":
        config.timeout_seconds = formData.timeout;
        break;
      case "FunctionCallTermination":
        config.function_name = formData.functionName;
        break;
      case "HandoffTermination":
        config.target = formData.target;
        break;
      case "TokenUsageTermination":
        config.max_total_token = formData.maxTotalToken;
        config.max_prompt_token = formData.maxPromptToken;
        config.max_completion_token = formData.maxCompletionToken;
        break;
      case "SourceMatchTermination":
        config.sources = formData.sources.split(",").map(s => s.trim()).filter(s => s);
        break;
      case "TextMessageTermination":
        config.source = formData.source;
        break;
      case "StopMessageTermination":
      case "ExternalTermination":
        // These have empty configs
        break;
      case "OrTerminationCondition":
        // This is complex and would need special handling - skip for now
        break;
    }

    return {
      component: {
        ...selectedConfig,
        config
      }
    };
  };

  const handleSave = async () => {
    if (!selectedConfigType) {
      toast.error("Please select a termination type");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const componentData = buildComponentData();
    if (!componentData) {
      toast.error("Invalid configuration");
      return;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: termination!.id,
          data: componentData
        });
        toast.success("Termination condition updated successfully");
      } else {
        await createMutation.mutateAsync(componentData);
        toast.success("Termination condition created successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save termination condition");
    }
  };

  if (!isOpen) return null;

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
                {isEditing ? 'Edit Termination Configuration' : 'Create Termination Configuration'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">Configure termination conditions and behavior</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
                            {/* Termination Type Selection */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 text-lg">Termination Type</h4>

                <div className="space-y-2">
                  <Label htmlFor="terminationType">Type</Label>
                  {configsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-gray-500">Loading termination types...</span>
                    </div>
                  ) : (
                    <Select value={selectedConfigType} onValueChange={setSelectedConfigType} disabled={isEditing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select termination type" />
                      </SelectTrigger>
                      <SelectContent>
                        {terminationConfigs?.map(config => (
                          <SelectItem key={config.label} value={config.label}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500">Termination type cannot be changed when editing</p>
                  )}
                </div>
              </div>

              {/* Component Details */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Component Details</h4>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Termination name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Termination description"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

                            {/* Dynamic Configuration based on selected type */}
              {selectedConfigType && (
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 text-lg">Configuration</h4>

                  {selectedConfigType === "TextMentionTermination" && (
                    <div className="space-y-2">
                      <Label htmlFor="terminationText">Termination Text</Label>
                      <Input
                        id="terminationText"
                        value={formData.terminationText}
                        onChange={(e) => setFormData({...formData, terminationText: e.target.value})}
                        placeholder="TASK_COMPLETE, STOP, ERROR, etc."
                      />
                      <p className="text-xs text-gray-500">
                        Enter the text that will trigger this termination condition when mentioned by an agent.
                      </p>
                    </div>
                  )}

                  {selectedConfigType === "MaxMessageTermination" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxMessages">Maximum Messages</Label>
                        <Input
                          id="maxMessages"
                          type="number"
                          value={formData.maxMessages}
                          onChange={(e) => setFormData({...formData, maxMessages: parseInt(e.target.value) || 10})}
                          placeholder="10"
                          min="1"
                        />
                        <p className="text-xs text-gray-500">
                          Maximum number of messages before termination.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="includeAgentEvent"
                          checked={formData.includeAgentEvent}
                          onChange={(e) => setFormData({...formData, includeAgentEvent: e.target.checked})}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <Label htmlFor="includeAgentEvent" className="text-sm">Include Agent Events</Label>
                      </div>
                    </div>
                  )}

                  {selectedConfigType === "TimeoutTermination" && (
                    <div className="space-y-2">
                      <Label htmlFor="timeout">Timeout (seconds)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={formData.timeout}
                        onChange={(e) => setFormData({...formData, timeout: parseInt(e.target.value) || 1000})}
                        placeholder="1000"
                        min="1"
                      />
                      <p className="text-xs text-gray-500">
                        Timeout duration in seconds before termination.
                      </p>
                    </div>
                  )}

                  {selectedConfigType === "FunctionCallTermination" && (
                    <div className="space-y-2">
                      <Label htmlFor="functionName">Function Name</Label>
                      <Input
                        id="functionName"
                        value={formData.functionName}
                        onChange={(e) => setFormData({...formData, functionName: e.target.value})}
                        placeholder="TERMINATE"
                      />
                      <p className="text-xs text-gray-500">
                        Function name that triggers termination when called.
                      </p>
                    </div>
                  )}

                  {selectedConfigType === "HandoffTermination" && (
                    <div className="space-y-2">
                      <Label htmlFor="target">Target Agent</Label>
                      <Input
                        id="target"
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: e.target.value})}
                        placeholder="assistant_agent"
                      />
                      <p className="text-xs text-gray-500">
                        Target agent for handoff termination.
                      </p>
                    </div>
                  )}

                  {selectedConfigType === "TokenUsageTermination" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxTotalToken">Maximum Total Tokens</Label>
                        <Input
                          id="maxTotalToken"
                          type="number"
                          value={formData.maxTotalToken}
                          onChange={(e) => setFormData({...formData, maxTotalToken: parseInt(e.target.value) || 100})}
                          placeholder="100"
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxPromptToken">Maximum Prompt Tokens</Label>
                        <Input
                          id="maxPromptToken"
                          type="number"
                          value={formData.maxPromptToken}
                          onChange={(e) => setFormData({...formData, maxPromptToken: parseInt(e.target.value) || 100})}
                          placeholder="100"
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxCompletionToken">Maximum Completion Tokens</Label>
                        <Input
                          id="maxCompletionToken"
                          type="number"
                          value={formData.maxCompletionToken}
                          onChange={(e) => setFormData({...formData, maxCompletionToken: parseInt(e.target.value) || 100})}
                          placeholder="100"
                          min="1"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Terminate when token usage limits are reached.
                      </p>
                    </div>
                  )}

                  {selectedConfigType === "SourceMatchTermination" && (
                    <div className="space-y-2">
                      <Label htmlFor="sources">Sources (comma-separated)</Label>
                      <Input
                        id="sources"
                        value={formData.sources}
                        onChange={(e) => setFormData({...formData, sources: e.target.value})}
                        placeholder="assistant_agent, user_agent"
                      />
                      <p className="text-xs text-gray-500">
                        Enter agent names separated by commas. Terminates when any of these sources responds.
                      </p>
                    </div>
                  )}

                  {selectedConfigType === "TextMessageTermination" && (
                    <div className="space-y-2">
                      <Label htmlFor="source">Source Agent</Label>
                      <Input
                        id="source"
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                        placeholder="assistant_agent"
                      />
                      <p className="text-xs text-gray-500">
                        Terminate when a text message is received from this source.
                      </p>
                    </div>
                  )}

                  {(selectedConfigType === "StopMessageTermination" || selectedConfigType === "ExternalTermination") && (
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-600">
                        This termination condition requires no additional configuration.
                      </p>
                      {selectedConfigType === "StopMessageTermination" && (
                        <p className="text-xs text-gray-500 mt-2">
                          Terminates when a StopMessage is received.
                        </p>
                      )}
                      {selectedConfigType === "ExternalTermination" && (
                        <p className="text-xs text-gray-500 mt-2">
                          Externally controlled termination condition.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedConfigType === "OrTerminationCondition" && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 font-medium">Complex Condition</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        OrTerminationCondition combines multiple conditions and requires advanced configuration.
                        This is not supported in the UI yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Configuration Info */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Configuration Guidelines</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Case Sensitive</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Termination text matching is case-sensitive. Use consistent casing across your agents.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Exact Match</p>
                      <p className="text-xs text-gray-500 mt-1">
                        The termination text must appear exactly as specified in the agent's output.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Best Practices</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Use clear, unique termination keywords that won't accidentally trigger during normal conversation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? 'Update Configuration' : 'Create Configuration'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
