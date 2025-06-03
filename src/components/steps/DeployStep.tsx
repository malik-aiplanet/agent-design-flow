import { useState } from "react";
import { CheckCircle, Loader2, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
export const DeployStep = ({
  data,
  onUpdate,
  hasUnsavedChanges,
  onSave
}: any) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const navigate = useNavigate();
  const handleDeploy = async () => {
    setIsDeploying(true);

    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeploying(false);
    setIsDeployed(true);

    // Show success animation
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  const handleTest = () => {
    // Navigate to chat interface for testing
    navigate("/chat/test");
  };
  const handleSaveAndDeploy = async () => {
    if (hasUnsavedChanges) {
      onSave();
      // Wait a moment for save to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    handleDeploy();
  };
  return <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Deploy Your Workflow</h3>
        <p className="text-gray-600">Review your configuration and deploy your AI workflow.</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workflow Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Workflow Name</span>
              <p className="font-medium">Customer Support Workflow</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Operator</span>
              <p className="font-medium">OpenAI</p>
            </div>
          </div>
          
          <div>
            <span className="text-sm text-gray-500">Input Types</span>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">Text</Badge>
              <Badge variant="secondary">File</Badge>
              <Badge variant="secondary">URL</Badge>
            </div>
          </div>

          <div>
            <span className="text-sm text-gray-500">Sub Agents</span>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Agent 1 - Research
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Agent 2 - Analysis
              </Badge>
            </div>
          </div>
          
          <div>
            <span className="text-sm text-gray-500">Tools</span>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">Taskade Actions</Badge>
              <Badge variant="secondary">Media</Badge>
            </div>
          </div>

          <div>
            <span className="text-sm text-gray-500">Termination Conditions</span>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">Max Iterations</Badge>
              <Badge variant="secondary">User Approval</Badge>
            </div>
          </div>
          
          <div>
            <span className="text-sm text-gray-500">Output Format</span>
            <p className="font-medium">JSON</p>
          </div>
        </CardContent>
      </Card>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium">You have unsaved changes that will be saved before deployment.</span>
            </div>
          </CardContent>
        </Card>}

      {/* Deployment Status */}
      {isDeployed && <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-900 mb-2">Workflow Deployed Successfully! 🎉</h3>
            <p className="text-green-700">Your workflow is now ready to use.</p>
          </CardContent>
        </Card>}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleTest} disabled={isDeploying} className="flex-1">
          Run Test
        </Button>
        
        <Button onClick={handleSaveAndDeploy} disabled={isDeploying || isDeployed} className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isDeploying ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
            </> : isDeployed ? <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Deployed
            </> : <>
              <Rocket className="mr-2 h-4 w-4" />
              {hasUnsavedChanges ? "Save & Deploy System" : "Deploy System"}
            </>}
        </Button>
      </div>

      
    </div>;
};