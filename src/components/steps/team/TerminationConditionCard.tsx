
import { useState } from "react";
import { Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const terminationConditions = [
  { value: "max-iterations", label: "Max Iterations" },
  { value: "time-limit", label: "Time Limit" },
  { value: "success-condition", label: "Success Condition" },
  { value: "user-approval", label: "User Approval" }
];

export const TerminationConditionCard = () => {
  const [terminationCondition, setTerminationCondition] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          Termination Condition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={terminationCondition} onValueChange={setTerminationCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {terminationConditions.map(condition => (
              <SelectItem key={condition.value} value={condition.value}>
                {condition.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
