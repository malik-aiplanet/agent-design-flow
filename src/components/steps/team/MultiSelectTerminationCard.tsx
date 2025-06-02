
import { useState } from "react";
import { Zap, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const terminationConditions = [
  { 
    value: "max-iterations", 
    label: "Max Iterations",
    hasInput: true,
    inputType: "number",
    inputPlaceholder: "e.g., 100"
  },
  { 
    value: "time-limit", 
    label: "Time Limit",
    hasInput: true,
    inputType: "number",
    inputPlaceholder: "Minutes"
  },
  { 
    value: "success-condition", 
    label: "Success Condition",
    hasInput: true,
    inputType: "text",
    inputPlaceholder: "Define success criteria"
  },
  { 
    value: "user-approval", 
    label: "User Approval",
    hasInput: false
  }
];

export const MultiSelectTerminationCard = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [conditionValues, setConditionValues] = useState<Record<string, string>>({});

  const toggleCondition = (conditionValue: string) => {
    setSelectedConditions(prev => 
      prev.includes(conditionValue)
        ? prev.filter(c => c !== conditionValue)
        : [...prev, conditionValue]
    );
  };

  const updateConditionValue = (conditionValue: string, value: string) => {
    setConditionValues(prev => ({
      ...prev,
      [conditionValue]: value
    }));
  };

  const removeCondition = (conditionValue: string) => {
    setSelectedConditions(prev => prev.filter(c => c !== conditionValue));
    setConditionValues(prev => {
      const { [conditionValue]: removed, ...rest } = prev;
      return rest;
    });
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
                const condition = terminationConditions.find(c => c.value === conditionValue);
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

        {/* Condition Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Available Conditions:</Label>
          {terminationConditions.map(condition => (
            <div key={condition.value} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={condition.value}
                  checked={selectedConditions.includes(condition.value)}
                  onCheckedChange={() => toggleCondition(condition.value)}
                />
                <Label 
                  htmlFor={condition.value}
                  className="text-sm font-normal cursor-pointer"
                >
                  {condition.label}
                </Label>
              </div>
              
              {/* Conditional Input Field */}
              {condition.hasInput && selectedConditions.includes(condition.value) && (
                <div className="ml-6">
                  <Input
                    type={condition.inputType}
                    placeholder={condition.inputPlaceholder}
                    value={conditionValues[condition.value] || ""}
                    onChange={(e) => updateConditionValue(condition.value, e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedConditions.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Select one or more termination conditions for your agent.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
