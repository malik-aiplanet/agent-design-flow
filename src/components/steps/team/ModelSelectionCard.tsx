import { Brain, Loader2, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModels } from "@/hooks/useModels";
import { useEffect } from "react";

interface ModelSelectionCardProps {
    selectedModelId?: string;
    onUpdate?: (data: { selectedModelId: string; selectedModel: any }) => void;
}

export const ModelSelectionCard = ({ selectedModelId, onUpdate }: ModelSelectionCardProps) => {
  // Fetch models from API
  const { data: modelsResponse, isLoading, error } = useModels({ limit: 100 });
  const models = (modelsResponse as any)?.items || [];

  // Debug logging
  useEffect(() => {
    console.log('ModelSelectionCard - selectedModelId changed:', selectedModelId);
  }, [selectedModelId]);

  const handleModelSelect = (modelId: string) => {
    const selectedModel = models.find((model: any) => model.id === modelId);
    onUpdate?.({
      selectedModelId: modelId,
      selectedModel
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Operator Model
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select the AI model that will act as the operator for this selector group chat
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Loading models...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">Failed to load models</span>
          </div>
        )}

        {!isLoading && !error && (
          <Select
            value={selectedModelId || ""}
            onValueChange={handleModelSelect}
            key={`model-select-${selectedModelId}`}
          >
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

        {!isLoading && !error && models.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No models available</p>
            <p className="text-xs text-gray-400 mt-1">
              Please create models in the Models Management section first
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
