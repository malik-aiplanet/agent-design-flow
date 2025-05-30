
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    title: "LLMs",
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

interface ComponentLibraryProps {
  onDragStart: (component: ComponentItem) => void;
}

export const ComponentLibrary = ({ onDragStart }: ComponentLibraryProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["inputs", "llms"]);

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleDragStart = (event: React.DragEvent, component: ComponentItem) => {
    event.dataTransfer.setData('application/json', JSON.stringify(component));
    onDragStart(component);
  };

  return (
    <div className="w-80 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Components</h3>
        <p className="text-sm text-slate-600">Drag components to the canvas to build your workflow</p>
      </div>

      <div className="space-y-3">
        {Object.entries(componentCategories).map(([categoryKey, category]) => (
          <Card key={categoryKey} className="border-slate-200">
            <CardHeader className="p-3">
              <CardTitle className="text-sm">
                <Button
                  variant="ghost"
                  className="w-full justify-start p-0 h-auto font-semibold text-slate-700"
                  onClick={() => toggleCategory(categoryKey)}
                >
                  {expandedCategories.includes(categoryKey) ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  {category.title}
                </Button>
              </CardTitle>
            </CardHeader>
            
            {expandedCategories.includes(categoryKey) && (
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="p-3 bg-white border border-slate-200 rounded-lg cursor-grab hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800">{item.name}</div>
                          <div className="text-xs text-slate-600 truncate">{item.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
