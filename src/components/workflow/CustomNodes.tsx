
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const nodeTypeConfig = {
  input: {
    bgColor: "bg-white",
    borderColor: "border-green-200",
    textColor: "text-gray-800",
    accentColor: "bg-green-100"
  },
  llm: {
    bgColor: "bg-white",
    borderColor: "border-blue-200", 
    textColor: "text-gray-800",
    accentColor: "bg-blue-100"
  },
  knowledge: {
    bgColor: "bg-white",
    borderColor: "border-purple-200",
    textColor: "text-gray-800",
    accentColor: "bg-purple-100"
  },
  logic: {
    bgColor: "bg-white",
    borderColor: "border-orange-200",
    textColor: "text-gray-800",
    accentColor: "bg-orange-100"
  },
  output: {
    bgColor: "bg-white",
    borderColor: "border-red-200",
    textColor: "text-gray-800",
    accentColor: "bg-red-100"
  }
};

interface CustomNodeProps {
  id: string;
  data: {
    label?: string;
    description?: string;
    type?: string;
    icon?: string;
    provider?: string;
    model?: string;
  };
  selected?: boolean;
}

export const CustomNode = memo(({ id, data, selected }: CustomNodeProps) => {
  const nodeType = data.type || "input";
  const config = nodeTypeConfig[nodeType as keyof typeof nodeTypeConfig] || nodeTypeConfig.input;

  return (
    <div className={`
      relative min-w-[160px] max-w-[200px] 
      ${config.bgColor} ${config.borderColor} border-2 rounded-xl
      shadow-sm hover:shadow-md transition-all duration-200
      ${selected ? 'ring-2 ring-blue-400 ring-offset-2 shadow-md' : ''}
    `}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-300 border-2 border-white shadow-sm"
      />
      
      {/* Node Header */}
      <div className={`${config.accentColor} px-3 py-2 rounded-t-xl border-b ${config.borderColor}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{data.icon || "⚪"}</span>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-semibold ${config.textColor} truncate`}>
              {data.label || "Node"}
            </div>
          </div>
        </div>
      </div>

      {/* Node Content */}
      <div className="px-3 py-3">
        {data.description && (
          <div className="text-xs text-gray-600 leading-relaxed">
            {data.description}
          </div>
        )}
        
        {/* Additional info for LLM nodes */}
        {nodeType === "llm" && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {data.provider || "Provider"} • {data.model || "Model"}
            </div>
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-300 border-2 border-white shadow-sm"
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
