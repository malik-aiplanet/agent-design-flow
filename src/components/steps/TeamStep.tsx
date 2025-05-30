
import { useState } from "react";
import { Plus, X, FileText, Upload, Link, Image, Bot, Brain, Wrench, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface InputComponent {
  id: string;
  type: string;
  enabled: boolean;
  icon: React.ComponentType<any>;
}

const inputTypes = [{
  value: "text",
  label: "Text",
  icon: FileText
}, {
  value: "file",
  label: "File",
  icon: Upload
}, {
  value: "url",
  label: "URL",
  icon: Link
}, {
  value: "image",
  label: "Image",
  icon: Image
}];

const models = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3", label: "Claude 3" },
  { value: "gemini-pro", label: "Gemini Pro" }
];

const terminationConditions = [
  { value: "max-iterations", label: "Max Iterations" },
  { value: "time-limit", label: "Time Limit" },
  { value: "success-condition", label: "Success Condition" },
  { value: "user-approval", label: "User Approval" }
];

const availableAgents = [
  { id: "agent1", name: "Agent 1", description: "Primary research agent" },
  { id: "agent2", name: "Agent 2", description: "Analysis specialist" },
  { id: "agent3", name: "Agent 3", description: "Content generator" }
];

const availableTools = [
  { id: "web-search", name: "Web Search", icon: Zap },
  { id: "calculator", name: "Calculator", icon: Wrench },
  { id: "file-reader", name: "File Reader", icon: FileText },
  { id: "image-analysis", name: "Image Analysis", icon: Image }
];

export const TeamStep = ({
  data,
  onUpdate
}: any) => {
  const [inputs, setInputs] = useState<InputComponent[]>([{
    id: "1",
    type: "text",
    enabled: true,
    icon: FileText
  }]);

  const [selectedModel, setSelectedModel] = useState("");
  const [terminationCondition, setTerminationCondition] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState<string[]>(["json"]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [systemPrompt, setSystemPrompt] = useState("");

  const addInput = () => {
    const newInput: InputComponent = {
      id: Date.now().toString(),
      type: "text",
      enabled: true,
      icon: FileText
    };
    setInputs([...inputs, newInput]);
  };

  const removeInput = (id: string) => {
    setInputs(inputs.filter(input => input.id !== id));
  };

  const updateInput = (id: string, field: string, value: any) => {
    setInputs(inputs.map(input => input.id === id ? {
      ...input,
      [field]: value
    } : input));
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const toggleOutputFormat = (format: string) => {
    setOutputFormat(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-3">Team Configuration</h3>
        <p className="text-gray-600">Configure your agent team's model, behavior, and capabilities.</p>
      </div>

      {/* Input Components - Moved to first position */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Input Components</CardTitle>
          <Button onClick={addInput} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Input
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {inputs.map(input => {
            const IconComponent = inputTypes.find(type => type.value === input.type)?.icon || FileText;
            return (
              <div key={input.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Type</Label>
                    <Select value={input.type} onValueChange={value => updateInput(input.id, "type", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {inputTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs text-gray-500">Enabled</Label>
                      <div className="mt-2">
                        <Switch 
                          checked={input.enabled} 
                          onCheckedChange={checked => updateInput(input.id, "enabled", checked)} 
                        />
                      </div>
                    </div>
                    {inputs.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeInput(input.id)} 
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Model & Termination */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Termination Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={terminationCondition} onValueChange={setTerminationCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {terminationConditions.map(condition => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Agents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {availableAgents.map(agent => (
              <div key={agent.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  checked={selectedAgents.includes(agent.id)}
                  onCheckedChange={() => toggleAgent(agent.id)}
                />
                <div className="flex-1">
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-gray-500">{agent.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Output Format */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Output Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {["json", "markdown"].map(format => (
              <button
                key={format}
                onClick={() => toggleOutputFormat(format)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  outputFormat.includes(format)
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-5 w-5 text-purple-600" />
            Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {availableTools.map(tool => {
              const IconComponent = tool.icon;
              return (
                <div 
                  key={tool.id} 
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Checkbox 
                    checked={selectedTools.includes(tool.id)}
                    onCheckedChange={() => toggleTool(tool.id)}
                  />
                  <IconComponent className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{tool.name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter the system prompt that will guide your agent team's behavior..."
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};
