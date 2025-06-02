import { useState } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Tool {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  lastModified: string;
}

interface ToolConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
}

export const ToolConfigurationDrawer = ({ isOpen, onClose, tool }: ToolConfigurationDrawerProps) => {
  const isEditMode = !!tool;
  
  const [formData, setFormData] = useState({
    name: tool?.name || "",
    description: tool?.description || "",
    functionName: "web_scrape",
    globalImports: "import requests\nfrom bs4 import BeautifulSoup",
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
        }`
  });

  const handleSave = () => {
    console.log("Saving tool configuration:", formData);
    onClose();
  };

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
                  <Label htmlFor="functionName">Function Name</Label>
                  <Input
                    id="functionName"
                    value={formData.functionName}
                    onChange={(e) => setFormData({...formData, functionName: e.target.value})}
                    placeholder="Function name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="globalImports">Global Imports</Label>
                  <Textarea
                    id="globalImports"
                    value={formData.globalImports}
                    onChange={(e) => setFormData({...formData, globalImports: e.target.value})}
                    placeholder="Import statements"
                    className="min-h-[100px] font-mono text-sm"
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
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
