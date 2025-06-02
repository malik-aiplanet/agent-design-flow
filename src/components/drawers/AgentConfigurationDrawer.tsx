
import { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  name: string;
  model: string;
  status: "Draft" | "Active" | "Deployed";
  lastEdited: string;
  description?: string;
}

interface AgentConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
}

export const AgentConfigurationDrawer = ({ isOpen, onClose, agent }: AgentConfigurationDrawerProps) => {
  const [formData, setFormData] = useState({
    name: agent?.name || "",
    description: agent?.description || "",
    internalName: "customer_support_agent",
    modelClient: "gpt-4o-mini",
    systemMessage: "You are a helpful customer support agent. Assist users with their inquiries professionally and efficiently.",
    tools: ["web_scraper", "email_sender"],
    reflectOnToolUse: true,
    streamModelClient: false,
    toolCallSummaryFormat: "Standard summary format with tool name and results"
  });

  const [newTool, setNewTool] = useState("");

  const handleSave = () => {
    console.log("Saving agent configuration:", formData);
    onClose();
  };

  const addTool = () => {
    if (newTool.trim()) {
      setFormData({
        ...formData,
        tools: [...formData.tools, newTool.trim()]
      });
      setNewTool("");
    }
  };

  const removeTool = (index: number) => {
    setFormData({
      ...formData,
      tools: formData.tools.filter((_, i) => i !== index)
    });
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
              <h3 className="text-xl font-semibold text-gray-900">Agent Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">Configure agent settings and behavior</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 text-lg">Basic Info</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Agent name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Agent description"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Configuration Section */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Configuration</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="internalName">Internal Name</Label>
                  <Input
                    id="internalName"
                    value={formData.internalName}
                    onChange={(e) => setFormData({...formData, internalName: e.target.value})}
                    placeholder="internal_agent_name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelClient">Model Client</Label>
                  <Input
                    id="modelClient"
                    value={formData.modelClient}
                    readOnly
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">Read-only field</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemMessage">System Message</Label>
                  <Textarea
                    id="systemMessage"
                    value={formData.systemMessage}
                    onChange={(e) => setFormData({...formData, systemMessage: e.target.value})}
                    placeholder="System instructions for the agent"
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              {/* Tools Section */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Tools</h4>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.tools.map((tool, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1"
                      >
                        {tool}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => removeTool(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      placeholder="Tool name"
                      onKeyPress={(e) => e.key === 'Enter' && addTool()}
                    />
                    <Button onClick={addTool} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reflectOnToolUse">Reflect on Tool Use</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Enable agent reflection on tool usage results
                      </p>
                    </div>
                    <Switch
                      id="reflectOnToolUse"
                      checked={formData.reflectOnToolUse}
                      onCheckedChange={(checked) => setFormData({...formData, reflectOnToolUse: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="streamModelClient">Stream Model Client</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Enable streaming responses from the model
                      </p>
                    </div>
                    <Switch
                      id="streamModelClient"
                      checked={formData.streamModelClient}
                      onCheckedChange={(checked) => setFormData({...formData, streamModelClient: checked})}
                    />
                  </div>
                </div>
              </div>

              {/* Additional */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Additional</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="toolCallSummaryFormat">Tool Call Summary Format</Label>
                  <Input
                    id="toolCallSummaryFormat"
                    value={formData.toolCallSummaryFormat}
                    onChange={(e) => setFormData({...formData, toolCallSummaryFormat: e.target.value})}
                    placeholder="Summary format description"
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
