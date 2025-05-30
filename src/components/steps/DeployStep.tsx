
import { useState } from "react";
import { CheckCircle, Loader2, Rocket, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DeploymentResultsModal } from "@/components/DeploymentResultsModal";

interface DeploymentStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
}

export const DeployStep = ({ data, onUpdate }: any) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"success" | "error" | "timeout" | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    { id: "validate", name: "Validating configuration", status: "pending" },
    { id: "build", name: "Building agent", status: "pending" },
    { id: "deploy", name: "Deploying to cloud", status: "pending" },
    { id: "verify", name: "Verifying deployment", status: "pending" },
  ]);
  const [deploymentData, setDeploymentData] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const simulateDeploymentStep = async (stepIndex: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate occasional failures for demo
        const shouldFail = Math.random() < 0.1; // 10% chance of failure
        setDeploymentSteps(prev => prev.map((step, idx) => {
          if (idx === stepIndex) {
            return { ...step, status: shouldFail ? "failed" : "completed" };
          }
          return step;
        }));
        resolve(!shouldFail);
      }, 1000 + Math.random() * 2000); // 1-3 seconds per step
    });
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentProgress(0);
    setDeploymentStatus(null);
    
    // Reset steps
    setDeploymentSteps(prev => prev.map(step => ({ ...step, status: "pending" })));

    toast({
      title: "Deployment Started",
      description: "Your agent deployment is now in progress...",
    });

    try {
      // Process each deployment step
      for (let i = 0; i < deploymentSteps.length; i++) {
        // Update current step to running
        setDeploymentSteps(prev => prev.map((step, idx) => {
          if (idx === i) return { ...step, status: "running" };
          return step;
        }));

        // Show toast for current step
        toast({
          title: deploymentSteps[i].name,
          description: `Step ${i + 1} of ${deploymentSteps.length}`,
        });

        const stepSuccess = await simulateDeploymentStep(i);
        
        if (!stepSuccess) {
          throw new Error(`Failed at step: ${deploymentSteps[i].name}`);
        }

        // Update progress
        setDeploymentProgress(((i + 1) / deploymentSteps.length) * 100);
      }

      // Simulate final deployment data
      const mockDeploymentData = {
        url: "https://customer-support-agent.lovable.app",
        deploymentId: "agent-" + Date.now(),
        deploymentTime: Math.floor(Math.random() * 5) + 3, // 3-8 seconds
        agentName: "Customer Support Agent",
      };

      setDeploymentData(mockDeploymentData);
      setDeploymentStatus("success");
      setShowResultsModal(true);

      toast({
        title: "🎉 Deployment Successful!",
        description: "Your agent is now live and ready to use.",
      });

    } catch (error) {
      const errorData = {
        error: error instanceof Error ? error.message : "Unknown deployment error",
        errorCode: "DEPLOY_FAILED",
        agentName: "Customer Support Agent",
      };
      
      setDeploymentData(errorData);
      setDeploymentStatus("error");
      setShowResultsModal(true);

      toast({
        title: "Deployment Failed",
        description: "There was an issue deploying your agent.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleRetry = () => {
    setShowResultsModal(false);
    setTimeout(() => {
      handleDeploy();
    }, 500);
  };

  const handleTest = () => {
    navigate("/chat/test");
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Deploy Your Agent</h3>
        <p className="text-gray-600">Review your configuration and deploy your AI agent to the cloud.</p>
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

      {/* Deployment Progress */}
      {isDeploying && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-blue-900">Deploying Agent...</h4>
                <span className="text-sm text-blue-700">{Math.round(deploymentProgress)}%</span>
              </div>
              
              <Progress value={deploymentProgress} className="h-2" />
              
              <div className="space-y-3">
                {deploymentSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    {getStepIcon(step.status)}
                    <span className={`text-sm ${
                      step.status === "completed" ? "text-green-700" :
                      step.status === "running" ? "text-blue-700" :
                      step.status === "failed" ? "text-red-700" :
                      "text-gray-600"
                    }`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
          disabled={isDeploying}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
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

      {/* Deployment Results Modal */}
      <DeploymentResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        deploymentStatus={deploymentStatus || "error"}
        deploymentData={deploymentData}
        onRetry={handleRetry}
      />
    </div>
  );
};
