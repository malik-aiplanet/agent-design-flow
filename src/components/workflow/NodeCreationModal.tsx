
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
}

const componentCategories = {
  inputs: {
    title: "Inputs",
    items: [
      { id: "user-message", name: "User Message", description: "Capture user input", icon: "💬", type: "input" },
      { id: "question", name: "Question", description: "Ask a specific question", icon: "❓", type: "input" },
      { id: "documents", name: "Documents", description: "Load documents", icon: "📄", type: "input" }
    ]
  },
  llms: {
    title: "AI Models",
    items: [
      { id: "claude", name: "Anthropic Claude", description: "Claude 3.5 Sonnet", icon: "🧠", type: "llm" },
      { id: "openai", name: "OpenAI GPT", description: "GPT-4o, GPT-4", icon: "🤖", type: "llm" },
      { id: "custom", name: "Custom Model", description: "Custom LLM endpoint", icon: "⚙️", type: "llm" }
    ]
  },
  knowledge: {
    title: "Knowledge",
    items: [
      { id: "vector-db", name: "Vector Database", description: "Semantic search", icon: "🗄️", type: "knowledge" },
      { id: "doc-loader", name: "Document Loader", description: "Load and process docs", icon: "📁", type: "knowledge" },
      { id: "web-search", name: "Web Search", description: "Search the internet", icon: "🌐", type: "knowledge" }
    ]
  },
  logic: {
    title: "Logic",
    items: [
      { id: "conditional", name: "Conditional", description: "If/then logic", icon: "🔀", type: "logic" },
      { id: "loop", name: "Loop", description: "Iterate over data", icon: "🔁", type: "logic" },
      { id: "transform", name: "Transform", description: "Modify data", icon: "🔄", type: "logic" }
    ]
  },
  outputs: {
    title: "Outputs",
    items: [
      { id: "answer", name: "Answer", description: "Provide response", icon: "💡", type: "output" },
      { id: "user-output", name: "User Output", description: "Display to user", icon: "📤", type: "output" },
      { id: "api-response", name: "API Response", description: "Return API data", icon: "🔗", type: "output" }
    ]
  }
};

interface NodeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (component: ComponentItem, position: { x: number; y: number }) => void;
}

export const NodeCreationModal = ({ isOpen, onClose, onAddNode }: NodeCreationModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("inputs");

  if (!isOpen) return null;

  const handleSelectComponent = (component: ComponentItem) => {
    // Add node at center of canvas
    onAddNode(component, { x: 400, y: 200 });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Component</h2>
            <p className="text-sm text-gray-600">Choose a component to add to your workflow</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[500px]">
          {/* Category Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-1">
              {Object.entries(componentCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Components Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {componentCategories[selectedCategory as keyof typeof componentCategories]?.items.map((item) => (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200"
                  onClick={() => handleSelectComponent(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
