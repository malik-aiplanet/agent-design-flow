
import { useState, useCallback } from "react";
import { Plus, Minus, RotateCcw, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CanvasNode {
  id: string;
  type: "input" | "model" | "agent" | "tool" | "output";
  x: number;
  y: number;
  label: string;
}

const nodeTypes = {
  input: { color: "bg-green-100 border-green-300 text-green-800", icon: "📥" },
  model: { color: "bg-blue-100 border-blue-300 text-blue-800", icon: "🧠" },
  agent: { color: "bg-purple-100 border-purple-300 text-purple-800", icon: "🤖" },
  tool: { color: "bg-orange-100 border-orange-300 text-orange-800", icon: "🔧" },
  output: { color: "bg-red-100 border-red-300 text-red-800", icon: "📤" }
};

export const CanvasStep = ({ data, onUpdate }: any) => {
  const [nodes, setNodes] = useState<CanvasNode[]>([
    { id: "1", type: "input", x: 100, y: 200, label: "Input" },
    { id: "2", type: "model", x: 300, y: 200, label: "Model" },
    { id: "3", type: "agent", x: 500, y: 200, label: "Agent" },
    { id: "4", type: "output", x: 700, y: 200, label: "Output" }
  ]);
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDraggedNode(nodeId);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedNode) {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;

      setNodes(nodes.map(node =>
        node.id === draggedNode ? { ...node, x, y } : node
      ));
    }
  }, [draggedNode, dragOffset, nodes]);

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const addNode = (type: keyof typeof nodeTypes) => {
    const newNode: CanvasNode = {
      id: Date.now().toString(),
      type,
      x: 400 + Math.random() * 100,
      y: 250 + Math.random() * 100,
      label: type.charAt(0).toUpperCase() + type.slice(1)
    };
    setNodes([...nodes, newNode]);
  };

  const resetCanvas = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Workflow Canvas</h3>
        <p className="text-gray-600">Design your agent workflow by connecting components.</p>
      </div>

      {/* Canvas Controls */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setZoom(zoom * 1.1)}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setZoom(zoom * 0.9)}>
          <Minus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={resetCanvas}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <div className="ml-4 flex gap-2">
          {Object.entries(nodeTypes).map(([type, config]) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => addNode(type as keyof typeof nodeTypes)}
              className="text-xs"
            >
              {config.icon} {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <Card className="h-96 overflow-hidden">
        <CardContent className="p-0 h-full">
          <div
            className="relative w-full h-full bg-gray-50 cursor-move"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.slice(0, -1).map((node, index) => {
                const nextNode = nodes[index + 1];
                if (nextNode) {
                  return (
                    <line
                      key={`line-${node.id}-${nextNode.id}`}
                      x1={node.x + 60}
                      y1={node.y + 30}
                      x2={nextNode.x}
                      y2={nextNode.y + 30}
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeDasharray="4"
                    />
                  );
                }
                return null;
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const config = nodeTypes[node.type];
              return (
                <div
                  key={node.id}
                  className={`absolute w-32 h-16 rounded-lg border-2 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform hover:scale-105 ${config.color}`}
                  style={{
                    left: node.x,
                    top: node.y,
                    transform: draggedNode === node.id ? "scale(1.1)" : "scale(1)"
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{config.icon}</div>
                    <div className="text-xs font-medium">{node.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500">
        Drag nodes to rearrange • Click add buttons to create new components • Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};
