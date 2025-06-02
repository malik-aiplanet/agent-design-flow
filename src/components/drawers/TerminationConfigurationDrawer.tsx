
import { useState } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Termination {
  id: string;
  name: string;
  description: string;
  terminationText: string;
  status: "Active" | "Inactive";
  lastModified: string;
}

interface TerminationConfigurationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  termination: Termination | null;
}

export const TerminationConfigurationDrawer = ({ isOpen, onClose, termination }: TerminationConfigurationDrawerProps) => {
  const [formData, setFormData] = useState({
    name: termination?.name || "",
    description: termination?.description || "",
    terminationText: termination?.terminationText || ""
  });

  const handleSave = () => {
    console.log("Saving termination configuration:", formData);
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
              <h3 className="text-xl font-semibold text-gray-900">Termination Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">Configure termination conditions and behavior</p>
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
                    placeholder="Termination name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Termination description"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Text Mention Configuration */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Text Mention Configuration</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="terminationText">Termination Text</Label>
                  <Input
                    id="terminationText"
                    value={formData.terminationText}
                    onChange={(e) => setFormData({...formData, terminationText: e.target.value})}
                    placeholder="TASK_COMPLETE, STOP, ERROR, etc."
                  />
                  <p className="text-xs text-gray-500">
                    Enter the text that will trigger this termination condition when mentioned by an agent.
                  </p>
                </div>
              </div>

              {/* Additional Configuration Info */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 text-lg">Configuration Guidelines</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Case Sensitive</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Termination text matching is case-sensitive. Use consistent casing across your agents.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Exact Match</p>
                      <p className="text-xs text-gray-500 mt-1">
                        The termination text must appear exactly as specified in the agent's output.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Best Practices</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Use clear, unique termination keywords that won't accidentally trigger during normal conversation.
                      </p>
                    </div>
                  </div>
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
