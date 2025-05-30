
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const SystemPromptCard = () => {
  const [systemPrompt, setSystemPrompt] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter the system prompt that will guide your agent team's behavior..."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[120px] resize-none"
        />
      </CardContent>
    </Card>
  );
};
