import { Wrench, Zap, FileText, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const availableTools = [
  { id: "web-search", name: "Web Search", icon: Zap },
  { id: "calculator", name: "Calculator", icon: Wrench },
  { id: "file-reader", name: "File Reader", icon: FileText },
  { id: "image-analysis", name: "Image Analysis", icon: Image }
];

interface ToolsSelectionCardProps {
    selectedTools?: string[];
    onUpdate?: (data: { selectedTools: string[] }) => void;
}

export const ToolsSelectionCard = ({ selectedTools, onUpdate }: ToolsSelectionCardProps) => {
  const handleToggleTool = (toolId: string) => {
    const tools = selectedTools || [];
    const newTools = tools.includes(toolId)
        ? tools.filter(id => id !== toolId)
        : [...tools, toolId];
    onUpdate?.({ selectedTools: newTools });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Wrench className="h-4 w-4 text-purple-600" />
          </div>
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
                  checked={selectedTools?.includes(tool.id)}
                  onCheckedChange={() => handleToggleTool(tool.id)}
                />
                <IconComponent className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{tool.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
