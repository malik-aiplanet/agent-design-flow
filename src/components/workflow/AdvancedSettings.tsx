
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
  const [expandedSections, setExpandedSections] = useState<string[]>(["basic", "model"]);

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
    <Card className="border-slate-200">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">
          <Button
            variant="ghost"
            className="w-full justify-start p-0 h-auto font-semibold text-slate-700"
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
        <CardContent className="p-3 pt-0 space-y-3">
          <div>
            <Label htmlFor="node-label" className="text-xs font-medium text-slate-700">Label</Label>
            <Input
              id="node-label"
              value={selectedNode.data?.label || ""}
              onChange={(e) => handleInputChange("label", e.target.value)}
              className="mt-1 text-sm border-slate-200"
              placeholder="Enter node label"
            />
          </div>
          
          <div>
            <Label htmlFor="node-description" className="text-xs font-medium text-slate-700">Description</Label>
            <Textarea
              id="node-description"
              value={selectedNode.data?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-1 text-sm border-slate-200"
              placeholder="Enter description"
              rows={2}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );

  const renderModelSettings = () => {
    if (selectedNode.type !== "llm") return null;

    return (
      <Card className="border-slate-200">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto font-semibold text-slate-700"
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
          <CardContent className="p-3 pt-0 space-y-3">
            <div>
              <Label className="text-xs font-medium text-slate-700">Provider</Label>
              <Select
                value={selectedNode.data?.provider || "anthropic"}
                onValueChange={(value) => handleInputChange("provider", value)}
              >
                <SelectTrigger className="mt-1 text-sm border-slate-200">
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
              <Label className="text-xs font-medium text-slate-700">Model</Label>
              <Select
                value={selectedNode.data?.model || "claude-3.5-sonnet"}
                onValueChange={(value) => handleInputChange("model", value)}
              >
                <SelectTrigger className="mt-1 text-sm border-slate-200">
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
              <Label className="text-xs font-medium text-slate-700">System Prompt</Label>
              <Textarea
                value={selectedNode.data?.systemPrompt || ""}
                onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
                className="mt-1 text-sm border-slate-200"
                placeholder="Enter system prompt"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-700">
                Temperature: {selectedNode.data?.temperature || 0.7}
              </Label>
              <Slider
                value={[selectedNode.data?.temperature || 0.7]}
                onValueChange={(value) => handleInputChange("temperature", value[0])}
                max={1}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="max-tokens" className="text-xs font-medium text-slate-700">Max Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                value={selectedNode.data?.maxTokens || 1000}
                onChange={(e) => handleInputChange("maxTokens", parseInt(e.target.value))}
                className="mt-1 text-sm border-slate-200"
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
    <div className="w-80 bg-slate-50 border-l border-slate-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Settings</h3>
          <p className="text-sm text-slate-600">{selectedNode.data?.label || selectedNode.type}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {renderBasicSettings()}
        {renderModelSettings()}
      </div>
    </div>
  );
};
