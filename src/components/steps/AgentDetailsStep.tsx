
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bot, Plus, X, FileText, Upload, Link, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export const AgentDetailsStep = ({ data, onUpdate }: any) => {
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [inputs, setInputs] = useState<InputComponent[]>([{
    id: "1",
    type: "text",
    enabled: true,
    icon: FileText
  }]);

  const handleNameChange = (value: string) => {
    setName(value);
    onUpdate?.({ name: value, description, inputs });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onUpdate?.({ name, description: value, inputs });
  };

  const addInput = () => {
    const newInput: InputComponent = {
      id: Date.now().toString(),
      type: "text",
      enabled: true,
      icon: FileText
    };
    const newInputs = [...inputs, newInput];
    setInputs(newInputs);
    onUpdate?.({ name, description, inputs: newInputs });
  };

  const removeInput = (id: string) => {
    const newInputs = inputs.filter(input => input.id !== id);
    setInputs(newInputs);
    onUpdate?.({ name, description, inputs: newInputs });
  };

  const updateInput = (id: string, field: string, value: any) => {
    const newInputs = inputs.map(input => input.id === id ? {
      ...input,
      [field]: value
    } : input);
    setInputs(newInputs);
    onUpdate?.({ name, description, inputs: newInputs });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">Agent Details</h3>
        <p className="text-gray-600 text-lg">Configure your agent's basic information and input components.</p>
      </div>

      {/* Agent Basics */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agent-name" className="text-sm font-medium text-gray-700">
              Agent Name *
            </Label>
            <Input
              id="agent-name"
              placeholder="e.g., Customer Support Agent, Content Writer..."
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">Give your agent a descriptive and memorable name.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="agent-description"
              placeholder="Describe what this agent does and how it helps users..."
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">Explain the agent's purpose and main capabilities.</p>
          </div>
        </CardContent>
      </Card>

      {/* Input Components */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Input Components</CardTitle>
          <Button onClick={addInput} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Input
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Configure how users will interact with your agent.</p>
          {inputs.map(input => {
            const IconComponent = inputTypes.find(type => type.value === input.type)?.icon || FileText;
            return (
              <div key={input.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Input Type</Label>
                    <Select value={input.type} onValueChange={value => updateInput(input.id, "type", value)}>
                      <SelectTrigger className="h-9">
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
                      <Label className="text-xs text-gray-500 mb-1 block">Enabled</Label>
                      <Switch 
                        checked={input.enabled} 
                        onCheckedChange={checked => updateInput(input.id, "enabled", checked)} 
                      />
                    </div>
                    {inputs.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeInput(input.id)} 
                        className="text-red-600 hover:text-red-700 mt-4"
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
    </div>
  );
};
