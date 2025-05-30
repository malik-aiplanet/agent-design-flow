
import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export const ModelStep = ({ data, onUpdate }: any) => {
  const [provider, setProvider] = useState("openai");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [deploymentName, setDeploymentName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">Model Configuration</h3>
        <p className="text-gray-600 leading-relaxed">Configure your AI model provider and credentials.</p>
      </div>

      {/* Provider Selection */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-900">Choose Provider</h4>
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              provider === "azure" 
                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" 
                : "border-gray-200 hover:border-gray-300"
            }`} 
            onClick={() => setProvider("azure")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-lg">Az</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Azure OpenAI</h4>
              <p className="text-sm text-gray-500">Enterprise-grade API</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              provider === "openai" 
                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" 
                : "border-gray-200 hover:border-gray-300"
            }`} 
            onClick={() => setProvider("openai")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">OpenAI</h4>
              <p className="text-sm text-gray-500">Direct API access</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Configuration */}
      <div className="space-y-6">
        <h4 className="text-base font-medium text-gray-900">API Configuration</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">API Key</Label>
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="pr-24 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  disabled={!apiKey}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Your API key is stored securely and never shared.</p>
          </div>

          {provider === "azure" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Deployment Name</Label>
              <Input
                value={deploymentName}
                onChange={(e) => setDeploymentName(e.target.value)}
                placeholder="e.g., gpt-4-deployment"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">Optional: Specify your Azure deployment name.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
