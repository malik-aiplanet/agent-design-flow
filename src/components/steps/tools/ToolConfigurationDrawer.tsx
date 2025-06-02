
import { useState } from "react";
import { X, RotateCcw, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ToolConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tool: {
    id: string;
    name: string;
    description: string;
    actions: number;
    code: string;
    defaultCode: string;
  } | null;
  onCodeChange: (toolId: string, code: string) => void;
}

export const ToolConfigurationDrawer = ({ 
  isOpen, 
  onClose, 
  tool, 
  onCodeChange 
}: ToolConfigurationDrawerProps) => {
  const [hasCustomCode, setHasCustomCode] = useState(false);

  if (!tool) return null;

  const handleCodeChange = (newCode: string) => {
    onCodeChange(tool.id, newCode);
    setHasCustomCode(newCode !== tool.defaultCode);
  };

  const resetToDefault = () => {
    onCodeChange(tool.id, tool.defaultCode);
    setHasCustomCode(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed right-0 top-0 h-full w-1/2 min-w-[500px] max-w-[800px] bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {tool.actions} action{tool.actions !== 1 ? 's' : ''}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">Configuration Code</h4>
              {hasCustomCode && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  Custom
                </Badge>
              )}
            </div>
            {hasCustomCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
            )}
          </div>

          {/* Code Editor */}
          <div className="flex-1 p-4">
            <Textarea
              value={tool.code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder={`Configure ${tool.name} behavior...`}
              className="w-full h-full min-h-[400px] font-mono text-sm bg-gray-50 border border-gray-300 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Write custom code to configure this tool's behavior. Changes are saved automatically.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
