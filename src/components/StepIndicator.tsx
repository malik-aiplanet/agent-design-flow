
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepIndicatorProps {
  step: {
    id: number;
    title: string;
    icon: React.ComponentType<any>;
  };
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export const StepIndicator = ({ step, isActive, isCompleted, onClick }: StepIndicatorProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start p-3 h-auto ${
        isActive ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
          isCompleted 
            ? "bg-green-100 border-green-500 text-green-600"
            : isActive 
            ? "bg-blue-100 border-blue-500 text-blue-600"
            : "border-gray-300 text-gray-400"
        }`}>
          {isCompleted ? (
            <Check className="h-4 w-4" />
          ) : (
            <step.icon className="h-4 w-4" />
          )}
        </div>
        <span className={`font-medium ${
          isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-600"
        }`}>
          {step.title}
        </span>
      </div>
    </Button>
  );
};
