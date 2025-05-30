
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ComponentLibrary } from "@/components/workflow/ComponentLibrary";
import { AdvancedSettings } from "@/components/workflow/AdvancedSettings";
import { CustomNode } from "@/components/workflow/CustomNodes";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 100 },
    data: { 
      label: "User Message", 
      type: "input",
      icon: "💬",
      description: "Capture user input"
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
    position: { x: 650, y: 100 },
    data: { 
      label: "Answer", 
      type: "output",
      icon: "💡",
      description: "Provide response"
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2", 
    target: "3",
    type: "smoothstep",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
];

export const CanvasStep = ({ data, onUpdate }: any) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: "smoothstep",
      style: { stroke: "#64748b", strokeWidth: 2 }
    }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const component = JSON.parse(event.dataTransfer.getData('application/json'));

      const position = {
        x: event.clientX - reactFlowBounds.left - 60,
        y: event.clientY - reactFlowBounds.top - 20,
      };

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
    },
    [nodes, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragStart = () => {
    // Handle drag start if needed
  };

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

  return (
    <div className="flex h-full">
      <ComponentLibrary onDragStart={handleDragStart} />
      
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
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            style={{ backgroundColor: "#f8fafc" }}
          >
            <Background 
              color="#e2e8f0" 
              gap={20} 
              size={1}
            />
            <Controls 
              className="bg-white border border-slate-200 rounded-lg"
            />
            <MiniMap 
              className="bg-white border border-slate-200 rounded-lg"
              nodeColor="#64748b"
            />
          </ReactFlow>
        </div>
      </div>

      {selectedNode && (
        <AdvancedSettings 
          selectedNode={selectedNode}
          onClose={handleCloseSettings}
          onUpdateNode={handleUpdateNode}
        />
      )}
    </div>
  );
};
