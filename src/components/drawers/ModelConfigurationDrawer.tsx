import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useModelConfigs, useCreateModel, useUpdateModel, useModel } from "@/hooks/useModels";
import { Model2, ModelCreate, ModelUpdate, ModelComponent } from "@/types/model";
import { toast } from "@/hooks/use-toast";

interface ModelConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model2 | null;
}

export const ModelConfigurationDrawer = ({ isOpen, onClose, model }: ModelConfigurationDrawerProps) => {
  const isEditMode = !!model;

  // Hooks for fetching configs and mutations
  const { data: modelConfigs, isLoading: isLoadingModelConfigs } = useModelConfigs();
  const { data: fullModelData, isLoading: isLoadingModelData } = useModel(model?.id || '');
  const createModelMutation = useCreateModel();
  const updateModelMutation = useUpdateModel();

  // Form state
  const [formData, setFormData] = useState({
    label: "",
    selectedModelProvider: "",
    modelConfig: {} as Record<string, any>,
  });

  // Track if this is the initial load to prevent overwriting existing config
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Reset initial load flag when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsInitialLoad(true);
    }
  }, [isOpen]);

  // Initialize form data when model or configs load
  useEffect(() => {
    if (model && isEditMode && fullModelData) {
      // Populate form with existing model data from full backend response
      const component = fullModelData.component;

      setFormData({
        label: component?.label || "",
        selectedModelProvider: component?.provider || "",
        modelConfig: component?.config || {},
      });
    } else if (!isEditMode) {
      // Reset form for new model
      setFormData({
        label: "",
        selectedModelProvider: "",
        modelConfig: {},
      });
    }
  }, [model, isEditMode, fullModelData]);

  // Update model config when provider changes
  useEffect(() => {
    if (formData.selectedModelProvider && modelConfigs) {
      const selectedModel = modelConfigs.find(m => m.provider === formData.selectedModelProvider);
      if (selectedModel && selectedModel.config) {
        // Only update with template config if:
        // 1. It's not the initial load (to avoid overwriting existing data in edit mode)
        // 2. AND it's not edit mode (we want to preserve existing values in edit mode)
        if (!isInitialLoad && !isEditMode) {
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
    if (!formData.label.trim()) {
      toast({
        title: "Validation Error",
        description: "Model label is required",
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

    if (!modelConfigs) {
      toast({
        title: "Error",
        description: "Model configurations not loaded",
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

    // Create the component structure
    const component: ModelComponent = {
      provider: selectedModel.provider,
      component_type: "model",
      version: selectedModel.version,
      component_version: selectedModel.component_version,
      description: selectedModel.description,
      label: formData.label || selectedModel.label,
      config: formData.modelConfig as any
    };

    try {
      if (isEditMode && model) {
        const updateData: ModelUpdate = { component };
        await updateModelMutation.mutateAsync({ id: model.id, data: updateData });
        toast({
          title: "Success",
          description: "Model updated successfully",
        });
      } else {
        const createData: ModelCreate = { component };
        await createModelMutation.mutateAsync(createData);
        toast({
          title: "Success",
          description: "Model created successfully",
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save model",
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

  const isLoading = isLoadingModelConfigs || (isEditMode && isLoadingModelData);
  const isSaving = createModelMutation.isPending || updateModelMutation.isPending;

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
                {isEditMode ? "Edit Model" : "Create New Model"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode ? "Configure model settings and parameters" : "Create a new AI model with dynamic configuration"}
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
                      <Label htmlFor="label">Label <span className="text-red-500">*</span></Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({...formData, label: e.target.value})}
                        placeholder="Enter model label (e.g., Production GPT-4)"
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
                          {modelConfigs?.map((modelConfig) => (
                            <SelectItem key={modelConfig.provider} value={modelConfig.provider}>
                              {modelConfig.label}
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
                      {isEditMode ? 'Update Model' : 'Create Model'}
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
