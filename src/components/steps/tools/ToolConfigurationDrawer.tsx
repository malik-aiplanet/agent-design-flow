
import { useState } from "react";
import { X, RotateCcw, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed right-0 top-0 h-full w-1/2 min-w-[600px] max-w-[900px] bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {tool.actions} action{tool.actions !== 1 ? 's' : ''}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <h4 className="font-medium text-gray-900 text-lg">Configuration Code</h4>
              {hasCustomCode && (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                  Modified
                </Badge>
              )}
            </div>
            {hasCustomCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                className="flex items-center gap-2 h-9"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              {/* Code Editor Section */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Custom Configuration
                  </label>
                  <p className="text-xs text-gray-500">
                    Write custom code to configure this tool's behavior. Changes are saved automatically.
                  </p>
                </div>
                
                <div className="relative">
                  <Textarea
                    value={tool.code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder={`Configure ${tool.name} behavior...`}
                    className="min-h-[500px] font-mono text-sm bg-gray-50 border border-gray-300 resize-none focus:bg-white transition-colors"
                    style={{ lineHeight: '1.5' }}
                  />
                  
                  {/* Code Editor Enhancement */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="text-xs bg-white/80 backdrop-blur-sm">
                      JavaScript
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h5 className="font-medium text-gray-900">Configuration Tips</h5>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Function Structure</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Define your main configuration functions and export them for use by the agent.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Error Handling</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Include proper error handling and validation for robust tool operation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Documentation</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Add comments to document your configuration for future reference.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Spacer */}
              <div className="h-8"></div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
