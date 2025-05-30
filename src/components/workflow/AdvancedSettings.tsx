
import { useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface AdvancedSettingsProps {
  selectedNode: any;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: any) => void;
}

export const AdvancedSettings = ({ selectedNode, onClose, onUpdateNode }: AdvancedSettingsProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["basic"]);

  if (!selectedNode) return null;

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleInputChange = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      [field]: value
    });
  };

  const renderBasicSettings = () => (
    <Card className="border-gray-200 shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">
          <Button
            variant="ghost"
            className="w-full justify-start p-0 h-auto font-medium text-gray-800 hover:bg-transparent"
            onClick={() => toggleSection("basic")}
          >
            {expandedSections.includes("basic") ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
            Basic Settings
          </Button>
        </CardTitle>
      </CardHeader>
      
      {expandedSections.includes("basic") && (
        <CardContent className="p-4 pt-0 space-y-4">
          <div>
            <Label htmlFor="node-label" className="text-xs font-medium text-gray-700 mb-1 block">Name</Label>
            <Input
              id="node-label"
              value={selectedNode.data?.label || ""}
              onChange={(e) => handleInputChange("label", e.target.value)}
              className="text-sm border-gray-200 focus:border-blue-400"
              placeholder="Enter node name"
            />
          </div>
          
          <div>
            <Label htmlFor="node-description" className="text-xs font-medium text-gray-700 mb-1 block">Description</Label>
            <Textarea
              id="node-description"
              value={selectedNode.data?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="text-sm border-gray-200 focus:border-blue-400 resize-none"
              placeholder="Enter description"
              rows={2}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );

  const renderModelSettings = () => {
    if (selectedNode.data?.type !== "llm") return null;

    return (
      <Card className="border-gray-200 shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto font-medium text-gray-800 hover:bg-transparent"
              onClick={() => toggleSection("model")}
            >
              {expandedSections.includes("model") ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              Model Configuration
            </Button>
          </CardTitle>
        </CardHeader>
        
        {expandedSections.includes("model") && (
          <CardContent className="p-4 pt-0 space-y-4">
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1 block">Provider</Label>
              <Select
                value={selectedNode.data?.provider || "anthropic"}
                onValueChange={(value) => handleInputChange("provider", value)}
              >
                <SelectTrigger className="text-sm border-gray-200 focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="azure">Azure OpenAI</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1 block">Model</Label>
              <Select
                value={selectedNode.data?.model || "claude-3.5-sonnet"}
                onValueChange={(value) => handleInputChange("model", value)}
              >
                <SelectTrigger className="text-sm border-gray-200 focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedNode.data?.provider === "anthropic" && (
                    <>
                      <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    </>
                  )}
                  {selectedNode.data?.provider === "openai" && (
                    <>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1 block">System Prompt</Label>
              <Textarea
                value={selectedNode.data?.systemPrompt || ""}
                onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
                className="text-sm border-gray-200 focus:border-blue-400 resize-none"
                placeholder="Enter system prompt"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-700 mb-2 block">
                Temperature: {selectedNode.data?.temperature || 0.7}
              </Label>
              <Slider
                value={[selectedNode.data?.temperature || 0.7]}
                onValueChange={(value) => handleInputChange("temperature", value[0])}
                max={1}
                min={0}
                step={0.1}
                className="py-2"
              />
            </div>

            <div>
              <Label htmlFor="max-tokens" className="text-xs font-medium text-gray-700 mb-1 block">Max Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                value={selectedNode.data?.maxTokens || 1000}
                onChange={(e) => handleInputChange("maxTokens", parseInt(e.target.value))}
                className="text-sm border-gray-200 focus:border-blue-400"
                min="1"
                max="8000"
              />
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
          <p className="text-sm text-gray-600">{selectedNode.data?.label || selectedNode.type}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {renderBasicSettings()}
        {renderModelSettings()}
      </div>
    </div>
  );
};
