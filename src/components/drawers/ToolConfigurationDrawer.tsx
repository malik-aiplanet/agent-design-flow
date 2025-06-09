import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tool2, ToolConfig } from "@/types/tool";
import { useTool, useCreateTool, useUpdateTool } from "@/hooks/useTools";

interface ToolConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool2 | null;
}

export const ToolConfigurationDrawer = ({ isOpen, onClose, tool }: ToolConfigurationDrawerProps) => {
  const isEditMode = !!tool;

  // Fetch full tool data if editing
  const { data: fullToolData, isLoading: isLoadingTool } = useTool(tool?.id || '');

  // Mutations
  const createToolMutation = useCreateTool();
  const updateToolMutation = useUpdateTool();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: "autogen_core.tools.FunctionTool",
    label: "FunctionTool",
    globalImports: "requests, bs4",
    sourceCode: `def web_scrape(url: str) -> dict:
    """
    Scrape content from a web page

    Args:
        url: The URL to scrape

    Returns:
        dict: Scraped content and metadata
    """
    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        return {
            "title": soup.title.string if soup.title else "",
            "content": soup.get_text().strip(),
            "status": "success"
        }
    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }`,
    hasCancellationSupport: false
  });

  // Initialize form data when tool or full data loads
  useEffect(() => {
    if (tool && isEditMode && fullToolData) {
      // Populate form with existing tool data from full backend response
      const component = fullToolData.component;
      const config = component?.config;

      setFormData({
        name: config?.name || "",
        description: config?.description || "",
        provider: component?.provider || "autogen_core.tools.FunctionTool",
        label: component?.label || "FunctionTool",
        globalImports: config?.global_imports?.join(', ') || "",
        sourceCode: config?.source_code || "",
        hasCancellationSupport: config?.has_cancellation_support || false
      });
    } else if (!isEditMode) {
      // Reset form for new tool
      setFormData({
        name: "",
        description: "",
        provider: "autogen_core.tools.FunctionTool",
        label: "FunctionTool",
        globalImports: "requests, bs4",
        sourceCode: `def web_scrape(url: str) -> dict:
    """
    Scrape content from a web page

    Args:
        url: The URL to scrape

    Returns:
        dict: Scraped content and metadata
    """
    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        return {
            "title": soup.title.string if soup.title else "",
            "content": soup.get_text().strip(),
            "status": "success"
        }
    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }`,
        hasCancellationSupport: false
      });
    }
  }, [tool, isEditMode, fullToolData]);

  const handleSave = async () => {
    try {
      const toolConfig: ToolConfig = {
        component_type: "tool",
        component_version: 1,
        config: {
          name: formData.name,
          description: formData.description,
          global_imports: formData.globalImports.split(',').map(s => s.trim()).filter(Boolean),
          source_code: formData.sourceCode,
          has_cancellation_support: formData.hasCancellationSupport,
        },
        description: "Create custom tools by wrapping standard Python functions.",
        label: formData.label,
        provider: formData.provider,
        version: 1,
      };

      if (isEditMode && tool?.id) {
        // Update existing tool
        await updateToolMutation.mutateAsync({
          id: tool.id,
          data: { component: toolConfig }
        });
      } else {
        // Create new tool
        await createToolMutation.mutateAsync({
          component: toolConfig
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving tool:', error);
      // Handle error (you might want to show a toast notification)
    }
  };

  const isLoading = isLoadingTool || createToolMutation.isPending || updateToolMutation.isPending;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-1/2 min-w-[600px] max-w-[900px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditMode ? "Tool Configuration" : "Add New Tool"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode ? "Configure tool settings and behavior" : "Create a new tool"}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Component Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 text-lg">Component Details</h4>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Tool name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tool description"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Configuration</h4>

                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    placeholder="Tool provider"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="Tool label"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="globalImports">Global Imports (comma separated)</Label>
                  <Input
                    id="globalImports"
                    value={formData.globalImports}
                    onChange={(e) => setFormData({...formData, globalImports: e.target.value})}
                    placeholder="requests, bs4, pandas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourceCode">Source Code</Label>
                  <Textarea
                    id="sourceCode"
                    value={formData.sourceCode}
                    onChange={(e) => setFormData({...formData, sourceCode: e.target.value})}
                    placeholder="Function implementation"
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
