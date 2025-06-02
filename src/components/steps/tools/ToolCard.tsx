import { useState } from "react";
import { Settings, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    actions: number;
    enabled: boolean;
    code: string;
    defaultCode: string;
  };
  onToggle: (toolId: string) => void;
  onConfigure: (toolId: string) => void;
}
export const ToolCard = ({
  tool,
  onToggle,
  onConfigure
}: ToolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasCustomCode = tool.code !== tool.defaultCode;
  return <Card className={`
        transition-all duration-200 hover:shadow-md cursor-pointer h-40
        ${tool.enabled ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" : "border-gray-200 hover:border-gray-300"}
      `} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {tool.name}
              </h4>
              {hasCustomCode && <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                  Custom
                </Badge>}
            </div>
            
          </div>
          <Switch checked={tool.enabled} onCheckedChange={() => onToggle(tool.id)} onClick={e => e.stopPropagation()} />
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 flex-1 mb-3">
          {tool.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          
          
          {tool.enabled && <Button variant="ghost" size="sm" onClick={e => {
          e.stopPropagation();
          onConfigure(tool.id);
        }} className={`
                text-xs h-7 px-2 transition-opacity
                ${isHovered ? "opacity-100" : "opacity-60"}
              `}>
              <Settings className="h-3 w-3 mr-1" />
              Configure
            </Button>}
        </div>
      </CardContent>
    </Card>;
};