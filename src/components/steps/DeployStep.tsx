
import { useState } from "react";
import { CheckCircle, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const DeployStep = ({ data, onUpdate }: any) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Deploy Your Agent</h3>
        <p className="text-gray-600">Review your configuration and deploy your AI agent.</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agent Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Agent Name</span>
              <p className="font-medium">Customer Support Agent</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Model</span>
              <p className="font-medium">GPT-4</p>
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
            <span className="text-sm text-gray-500">Tools</span>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">Taskade Actions</Badge>
              <Badge variant="secondary">Media</Badge>
            </div>
          </div>
          
          <div>
            <span className="text-sm text-gray-500">Output Format</span>
            <p className="font-medium">JSON</p>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Status */}
      {isDeployed && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-900 mb-2">Agent Deployed Successfully! 🎉</h3>
            <p className="text-green-700">Your agent is now ready to use.</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handleTest}
          disabled={isDeploying}
          className="flex-1"
        >
          Run Test
        </Button>
        
        <Button
          onClick={handleDeploy}
          disabled={isDeploying || isDeployed}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : isDeployed ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Deployed
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Deploy System
            </>
          )}
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="w-full"
        disabled={isDeploying}
      >
        Edit Configuration
      </Button>
    </div>
  );
};
