
import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdvancedSettings } from "@/components/workflow/AdvancedSettings";
import { CustomNode } from "@/components/workflow/CustomNodes";
import { NodeCreationModal } from "@/components/workflow/NodeCreationModal";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 200, y: 100 },
    data: { 
      label: "User Input", 
      type: "input",
      icon: "💬",
      description: "Capture user messages"
    },
  },
  {
    id: "2", 
    type: "custom",
    position: { x: 450, y: 100 },
    data: { 
      label: "Claude 3.5 Sonnet", 
      type: "llm",
      icon: "🧠",
      provider: "anthropic",
      model: "claude-3.5-sonnet"
    },
  },
  {
    id: "3",
    type: "custom", 
    position: { x: 700, y: 100 },
    data: { 
      label: "Response", 
      type: "output",
      icon: "💡",
      description: "Return AI response"
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    style: { stroke: "#6366f1", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2", 
    target: "3",
    type: "smoothstep",
    style: { stroke: "#6366f1", strokeWidth: 2 },
  },
];

export const CanvasStep = ({ data, onUpdate }: any) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showNodeModal, setShowNodeModal] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: "smoothstep",
      style: { stroke: "#6366f1", strokeWidth: 2 }
    }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleUpdateNode = (nodeId: string, newData: any) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId 
          ? { ...node, data: newData }
          : node
      )
    );
  };

  const handleCloseSettings = () => {
    setSelectedNode(null);
  };

  const handleAddNode = (component: any, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: "custom",
      position,
      data: {
        label: component.name,
        type: component.type,
        icon: component.icon,
        description: component.description,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
            proOptions={{ hideAttribution: true }}
          >
            <Background 
              color="#e5e7eb" 
              gap={20} 
              size={1}
              variant={BackgroundVariant.Dots}
            />
            <Controls 
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
              showInteractive={false}
            />
            <MiniMap 
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
              nodeColor="#6366f1"
              maskColor="rgba(99, 102, 241, 0.1)"
              pannable
              zoomable
            />
          </ReactFlow>
        </div>

        {/* Floating Add Button */}
        <div className="absolute bottom-6 right-6">
          <Button
            onClick={() => setShowNodeModal(true)}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {selectedNode && (
        <AdvancedSettings 
          selectedNode={selectedNode}
          onClose={handleCloseSettings}
          onUpdateNode={handleUpdateNode}
        />
      )}

      {/* Node Creation Modal */}
      {showNodeModal && (
        <NodeCreationModal
          isOpen={showNodeModal}
          onClose={() => setShowNodeModal(false)}
          onAddNode={handleAddNode}
        />
      )}
    </div>
  );
};
