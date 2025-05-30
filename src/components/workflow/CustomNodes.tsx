
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const nodeStyles = {
  input: "bg-green-50 border-green-200 text-green-800",
  llm: "bg-blue-50 border-blue-200 text-blue-800", 
  knowledge: "bg-purple-50 border-purple-200 text-purple-800",
  logic: "bg-orange-50 border-orange-200 text-orange-800",
  output: "bg-red-50 border-red-200 text-red-800"
};

const nodeIcons = {
  input: "💬",
  llm: "🧠", 
  knowledge: "🗄️",
  logic: "🔀",
  output: "💡"
};

interface CustomNodeProps {
  id: string;
  data: {
    label?: string;
    description?: string;
    type?: string;
    icon?: string;
  };
  selected?: boolean;
}

export const CustomNode = memo(({ id, data, selected }: CustomNodeProps) => {
  const nodeType = data.type || "input";
  const styleClass = nodeStyles[nodeType as keyof typeof nodeStyles] || nodeStyles.input;
  const icon = data.icon || nodeIcons[nodeType as keyof typeof nodeIcons] || "⚪";

  return (
    <div className={`px-4 py-3 border-2 rounded-lg min-w-[120px] ${styleClass} ${selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''} transition-all duration-200`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-slate-400 border-2 border-white"
      />
      
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{data.label || "Node"}</div>
          {data.description && (
            <div className="text-xs opacity-75 mt-1">{data.description}</div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-slate-400 border-2 border-white"
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
