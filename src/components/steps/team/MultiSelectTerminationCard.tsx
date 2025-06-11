import { Zap, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const terminationOptions = [
  { value: "max-iterations", label: "Max Iterations" },
  { value: "time-limit", label: "Time Limit" },
  { value: "success-condition", label: "Success Condition" },
  { value: "user-approval", label: "User Approval" },
  { value: "error-threshold", label: "Error Threshold" },
  { value: "cost-limit", label: "Cost Limit" }
];

interface MultiSelectTerminationCardProps {
    terminationConditions?: string[];
    onUpdate?: (data: { terminationConditions: string[] }) => void;
}

export const MultiSelectTerminationCard = ({ terminationConditions, onUpdate }: MultiSelectTerminationCardProps) => {
  const selectedConditions = terminationConditions || [];

  const handleSelectCondition = (value: string) => {
    if (!selectedConditions.includes(value)) {
      onUpdate?.({ terminationConditions: [...selectedConditions, value] });
    }
  };

  const removeCondition = (conditionValue: string) => {
    onUpdate?.({ terminationConditions: selectedConditions.filter(c => c !== conditionValue) });
  };

  const getAvailableOptions = () => {
    return terminationOptions.filter(option => !selectedConditions.includes(option.value));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          Termination Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Conditions Display */}
        {selectedConditions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selected Conditions:</Label>
            <div className="flex flex-wrap gap-2">
              {selectedConditions.map(conditionValue => {
                const condition = terminationOptions.find(c => c.value === conditionValue);
                return (
                  <Badge
                    key={conditionValue}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {condition?.label}
                    <button
                      onClick={() => removeCondition(conditionValue)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Condition Dropdown */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Add Condition:</Label>
          <Select onValueChange={handleSelectCondition} value="">
            <SelectTrigger>
              <SelectValue placeholder="Select a termination condition" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedConditions.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Select one or more termination conditions for your workflow.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
