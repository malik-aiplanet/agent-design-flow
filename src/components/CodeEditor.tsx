
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  placeholder?: string;
  defaultCode: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const CodeEditor = ({ 
  code, 
  onCodeChange, 
  placeholder, 
  defaultCode,
  isExpanded,
  onToggleExpanded
}: CodeEditorProps) => {
  const [hasCustomCode, setHasCustomCode] = useState(code !== defaultCode);

  const handleCodeChange = (newCode: string) => {
    onCodeChange(newCode);
    setHasCustomCode(newCode !== defaultCode);
  };

  const resetToDefault = () => {
    onCodeChange(defaultCode);
    setHasCustomCode(false);
  };

  return (
    <div className="border-t border-gray-200 mt-4">
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpanded}
          className="flex items-center gap-2 text-gray-700"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Configure Code
          {hasCustomCode && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
        </Button>
        
        {isExpanded && hasCustomCode && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-white">
          <Textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px] font-mono text-sm bg-gray-50 border border-gray-300"
            rows={12}
          />
          <p className="text-xs text-gray-500 mt-2">
            Write custom code to configure this tool's behavior
          </p>
        </div>
      )}
    </div>
  );
};
