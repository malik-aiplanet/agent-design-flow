
import { useState } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Model {
  id: string;
  name: string;
  description: string;
  modelId: string;
  status: "Active" | "Inactive";
  lastModified: string;
}

interface ModelConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model | null;
}

export const ModelConfigurationDrawer = ({ isOpen, onClose, model }: ModelConfigurationDrawerProps) => {
  const [formData, setFormData] = useState({
    name: model?.name || "",
    description: model?.description || "",
    model: model?.modelId || "gpt-4o-mini",
    apiKey: "",
    organization: "",
    baseUrl: "https://api.openai.com/v1",
    timeout: 30,
    maxRetries: 3,
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    stopSequences: ""
  });

  const handleSave = () => {
    console.log("Saving model configuration:", formData);
    onClose();
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
              <h3 className="text-xl font-semibold text-gray-900">Model Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">Configure model settings and parameters</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Component Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 text-lg">Component Details</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Model name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Model description"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Model Configuration */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Model Configuration</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      placeholder="gpt-4o-mini"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                      placeholder="sk-..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({...formData, organization: e.target.value})}
                      placeholder="org-..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">Base URL</Label>
                    <Input
                      id="baseUrl"
                      value={formData.baseUrl}
                      onChange={(e) => setFormData({...formData, baseUrl: e.target.value})}
                      placeholder="https://api.openai.com/v1"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Advanced</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={formData.timeout}
                      onChange={(e) => setFormData({...formData, timeout: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxRetries">Max Retries</Label>
                    <Input
                      id="maxRetries"
                      type="number"
                      value={formData.maxRetries}
                      onChange={(e) => setFormData({...formData, maxRetries: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              {/* Model Parameters */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Model Parameters</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={formData.temperature}
                      onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={formData.maxTokens}
                      onChange={(e) => setFormData({...formData, maxTokens: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="topP">Top P</Label>
                    <Input
                      id="topP"
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={formData.topP}
                      onChange={(e) => setFormData({...formData, topP: parseFloat(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
                    <Input
                      id="frequencyPenalty"
                      type="number"
                      step="0.1"
                      min="-2"
                      max="2"
                      value={formData.frequencyPenalty}
                      onChange={(e) => setFormData({...formData, frequencyPenalty: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="presencePenalty">Presence Penalty</Label>
                    <Input
                      id="presencePenalty"
                      type="number"
                      step="0.1"
                      min="-2"
                      max="2"
                      value={formData.presencePenalty}
                      onChange={(e) => setFormData({...formData, presencePenalty: parseFloat(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stopSequences">Stop Sequences</Label>
                    <Input
                      id="stopSequences"
                      value={formData.stopSequences}
                      onChange={(e) => setFormData({...formData, stopSequences: e.target.value})}
                      placeholder="Comma-separated values"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
