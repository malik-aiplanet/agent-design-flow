import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

interface SystemPromptCardProps {
    systemPrompt?: string;
    onUpdate?: (data: { systemPrompt: string }) => void;
}

export const SystemPromptCard = ({ systemPrompt, onUpdate }: SystemPromptCardProps) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </div>
          System Prompt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label htmlFor="system-prompt" className="text-sm font-medium text-gray-700">
          Define the agent's behavior and personality
        </Label>
        <Textarea
          id="system-prompt"
          placeholder="You are a helpful AI assistant that specializes in customer support. Always be friendly, professional, and solution-oriented. When you don't know something, acknowledge it honestly and offer to escalate to a human agent."
          value={systemPrompt}
          onChange={(e) => onUpdate?.({ systemPrompt: e.target.value })}
          className="min-h-[140px] resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
        />
        <div className="text-xs text-gray-500">
          Tip: Be specific about the agent's role, tone, and how it should handle different situations.
        </div>
      </CardContent>
    </Card>
  );
};
