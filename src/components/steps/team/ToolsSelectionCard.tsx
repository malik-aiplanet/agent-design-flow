
import { useState } from "react";
import { Wrench, Zap, FileText, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const availableTools = [
  { id: "web-search", name: "Web Search", icon: Zap },
  { id: "calculator", name: "Calculator", icon: Wrench },
  { id: "file-reader", name: "File Reader", icon: FileText },
  { id: "image-analysis", name: "Image Analysis", icon: Image }
];

export const ToolsSelectionCard = () => {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  return (
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
  );
};
