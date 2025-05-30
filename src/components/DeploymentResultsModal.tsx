
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Copy, ExternalLink, Share2, Play, RefreshCw, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DeploymentResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deploymentStatus: "success" | "error" | "timeout";
  deploymentData?: {
    url?: string;
    deploymentId?: string;
    deploymentTime?: number;
    agentName?: string;
    error?: string;
    errorCode?: string;
  };
  onRetry?: () => void;
}

export const DeploymentResultsModal = ({
  isOpen,
  onClose,
  deploymentStatus,
  deploymentData,
  onRetry
}: DeploymentResultsModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (deploymentStatus === "success" && isOpen) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [deploymentStatus, isOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const shareAgent = async () => {
    if (navigator.share && deploymentData?.url) {
      try {
        await navigator.share({
          title: `Check out my AI Agent: ${deploymentData.agentName}`,
          text: `I just deployed an AI agent that can help with various tasks!`,
          url: deploymentData.url,
        });
      } catch (err) {
        // Fallback to copying URL
        copyToClipboard(deploymentData.url);
      }
    } else if (deploymentData?.url) {
      copyToClipboard(deploymentData.url);
    }
  };

  const testAgent = () => {
    if (deploymentData?.deploymentId) {
      navigate(`/chat/${deploymentData.deploymentId}`);
    }
  };

  const renderSuccessContent = () => (
    <div className="space-y-6">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-bounce text-6xl">🎉</div>
        </div>
      )}
      
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          🚀 Agent Deployed Successfully!
        </h3>
        <p className="text-green-700">
          Your AI agent "{deploymentData?.agentName}" is now live and ready to use.
        </p>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">Deployment URL</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border">
            <code className="flex-1 text-sm text-gray-700 truncate">
              {deploymentData?.url || "https://your-agent.lovable.app"}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(deploymentData?.url || "")}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-green-600">
                <Clock className="h-4 w-4" />
                <span>{deploymentData?.deploymentTime || 3}s</span>
              </div>
              <p className="text-xs text-green-700">Deploy Time</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-green-600">
                <Zap className="h-4 w-4" />
                <span>Active</span>
              </div>
              <p className="text-xs text-green-700">Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={testAgent} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Play className="mr-2 h-4 w-4" />
          Test Agent
        </Button>
        <Button variant="outline" onClick={shareAgent} className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/")} className="flex-1">
          View Dashboard
        </Button>
        <Button variant="ghost" onClick={onClose} className="flex-1">
          Create Another
        </Button>
      </div>
    </div>
  );

  const renderErrorContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-red-900 mb-2">
          Deployment Failed
        </h3>
        <p className="text-red-700">
          {deploymentStatus === "timeout" 
            ? "Deployment timed out. This might be due to high server load."
            : "There was an issue deploying your agent. Please try again."
          }
        </p>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-800">Error Details</span>
              {deploymentData?.errorCode && (
                <Badge variant="destructive" className="text-xs">
                  {deploymentData.errorCode}
                </Badge>
              )}
            </div>
            <p className="text-sm text-red-700 bg-white p-2 rounded border">
              {deploymentData?.error || 
               (deploymentStatus === "timeout" 
                 ? "Request timed out after 30 seconds. Please check your connection and try again."
                 : "An unexpected error occurred during deployment."
               )
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Deployment
        </Button>
        <Button variant="outline" onClick={() => navigate("/")} className="flex-1">
          Back to Dashboard
        </Button>
      </div>

      <Button variant="ghost" onClick={onClose} className="w-full">
        Edit Configuration
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Deployment Results
          </DialogTitle>
        </DialogHeader>
        {deploymentStatus === "success" ? renderSuccessContent() : renderErrorContent()}
      </DialogContent>
    </Dialog>
  );
};
