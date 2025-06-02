
import { useState } from "react";
import { X, Save, Plus, Trash2, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { JSONEditor } from "@/components/JSONEditor";

interface Agent2 {
  id: string;
  name: string;
  description: string;
  modelClient: string;
  status: "Active" | "Inactive";
  lastModified: string;
  toolsCount: number;
}

interface Agents2ConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent2 | null;
}

export const Agents2ConfigurationDrawer = ({ isOpen, onClose, agent }: Agents2ConfigurationDrawerProps) => {
  const isEditMode = !!agent;
  
  const [formData, setFormData] = useState({
    name: agent?.name || "",
    description: agent?.description || "",
    modelClient: agent?.modelClient || "gpt-4-turbo-preview",
    systemMessage: "You are a helpful AI assistant. Follow instructions carefully and provide accurate responses.",
    reflectOnToolUse: true,
    streamModelClient: false,
    toolCallSummaryFormat: "Summary: {tool_name} was called with {parameters}",
    tools: [] as string[]
  });

  const [showJSONEditor, setShowJSONEditor] = useState(false);

  const handleSave = () => {
    console.log("Saving agent configuration:", formData);
    onClose();
  };

  const handleJSONUpdate = (data: any) => {
    setFormData(data);
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
                {isEditMode ? "Agent Configuration" : "Add New Agent"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode ? "Configure agent settings and behavior" : "Create a new AI agent"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowJSONEditor(!showJSONEditor)}
                className="h-10 px-3"
              >
                <FileJson className="h-4 w-4 mr-2" />
                JSON Editor
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {showJSONEditor ? (
            <div className="h-full p-6">
              <JSONEditor
                data={formData}
                title="Agent Configuration"
                onUpdate={handleJSONUpdate}
                readOnly={false}
              />
            </div>
          ) : (
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

                {/* Configuration */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 text-lg">Configuration</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="configName">Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="configName"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Required field"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelClient">Model Client</Label>
                    <Input
                      id="modelClient"
                      value={formData.modelClient}
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="systemMessage">System Message</Label>
                    <Textarea
                      id="systemMessage"
                      value={formData.systemMessage}
                      onChange={(e) => setFormData({...formData, systemMessage: e.target.value})}
                      placeholder="System message for the agent"
                      className="min-h-[120px]"
                    />
                  </div>
                </div>

                {/* Tools */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 text-lg">Tools</h4>
                    <Button variant="outline" size="sm" className="h-8">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tool
                    </Button>
                  </div>
                  
                  {formData.tools.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      No tools configured
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.tools.map((tool, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{tool}</span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggle Settings */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reflectOnToolUse" className="text-base font-medium">
                        Reflect on Tool Use
                      </Label>
                    </div>
                    <Switch
                      id="reflectOnToolUse"
                      checked={formData.reflectOnToolUse}
                      onCheckedChange={(checked) => setFormData({...formData, reflectOnToolUse: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="streamModelClient" className="text-base font-medium">
                        Stream Model Client
                      </Label>
                    </div>
                    <Switch
                      id="streamModelClient"
                      checked={formData.streamModelClient}
                      onCheckedChange={(checked) => setFormData({...formData, streamModelClient: checked})}
                    />
                  </div>
                </div>

                {/* Tool Call Summary Format */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 text-lg">Tool Call Summary Format</h4>
                  
                  <div className="space-y-2">
                    <Input
                      value={formData.toolCallSummaryFormat}
                      onChange={(e) => setFormData({...formData, toolCallSummaryFormat: e.target.value})}
                      placeholder="Enter summary format"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
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
