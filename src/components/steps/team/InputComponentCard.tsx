import { Plus, X, FileText, Upload, Link, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InputComponent {
  id: string;
  type: string;
  enabled: boolean;
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

interface InputComponentCardProps {
    inputComponents?: InputComponent[];
    onUpdate?: (inputComponents: InputComponent[]) => void;
}

export const InputComponentCard = ({ inputComponents, onUpdate }: InputComponentCardProps) => {
  const inputs = inputComponents && inputComponents.length > 0 ? inputComponents : [{
    id: "1",
    type: "text",
    enabled: true,
  }];

  const handleUpdate = (updatedInputs: InputComponent[]) => {
      onUpdate?.(updatedInputs);
  }

  const addInput = () => {
    const newInput: InputComponent = {
      id: Date.now().toString(),
      type: "text",
      enabled: true,
    };
    handleUpdate([...inputs, newInput]);
  };

  const removeInput = (id: string) => {
    handleUpdate(inputs.filter(input => input.id !== id));
  };

  const updateInput = (id: string, field: string, value: any) => {
    const updatedInputs = inputs.map(input => (input.id === id ? {
      ...input,
      [field]: value
    } : input));
    handleUpdate(updatedInputs);
  };

  return (
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
  );
};
