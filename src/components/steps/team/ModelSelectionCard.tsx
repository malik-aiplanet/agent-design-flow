
import { useState } from "react";
import { Brain } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const operators = [
  { value: "claude", label: "Claude" },
  { value: "openai", label: "OpenAI" },
  { value: "gemini", label: "Gemini" },
  { value: "llama", label: "LLaMA" }
];

export const ModelSelectionCard = () => {
  const [selectedOperator, setSelectedOperator] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Operator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedOperator} onValueChange={setSelectedOperator}>
          <SelectTrigger>
            <SelectValue placeholder="Select an operator" />
          </SelectTrigger>
          <SelectContent>
            {operators.map(operator => (
              <SelectItem key={operator.value} value={operator.value}>
                {operator.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
