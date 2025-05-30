
import { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const ModelStep = ({ data, onUpdate }: any) => {
  const [provider, setProvider] = useState("openai");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [deploymentName, setDeploymentName] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Model Configuration</h3>
        <p className="text-gray-600">Configure your AI model provider and credentials.</p>
      </div>

      {/* Provider Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8">
            <div className={`p-6 border-2 rounded-lg cursor-pointer transition-colors ${
              provider === "azure" ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`} onClick={() => setProvider("azure")}>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold text-sm">AZ</span>
                </div>
                <h4 className="font-medium">Azure OpenAI</h4>
              </div>
            </div>

            <div className={`p-6 border-2 rounded-lg cursor-pointer transition-colors ${
              provider === "openai" ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`} onClick={() => setProvider("openai")}>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-semibold text-sm">AI</span>
                </div>
                <h4 className="font-medium">OpenAI</h4>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>API Key</Label>
            <div className="relative mt-1">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-8 w-8 p-0"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(apiKey)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {provider === "azure" && (
            <div>
              <Label>Deployment Name</Label>
              <Input
                value={deploymentName}
                onChange={(e) => setDeploymentName(e.target.value)}
                placeholder="Enter deployment name (optional)"
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
