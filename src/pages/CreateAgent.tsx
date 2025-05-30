
import { useState } from "react";
import { Check, ChevronRight, Users, Bot, Brain, Wrench, FileText, Workflow, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/StepIndicator";
import { TeamStep } from "@/components/steps/TeamStep";
import { AgentStep } from "@/components/steps/AgentStep";
import { ModelStep } from "@/components/steps/ModelStep";
import { ToolsStep } from "@/components/steps/ToolsStep";
import { OutputStep } from "@/components/steps/OutputStep";
import { CanvasStep } from "@/components/steps/CanvasStep";
import { DeployStep } from "@/components/steps/DeployStep";

const steps = [
  { id: 1, title: "Team", icon: Users, component: TeamStep },
  { id: 2, title: "Agent", icon: Bot, component: AgentStep },
  { id: 3, title: "Model", icon: Brain, component: ModelStep },
  { id: 4, title: "Tools", icon: Wrench, component: ToolsStep },
  { id: 5, title: "Output", icon: FileText, component: OutputStep },
  { id: 6, title: "Canvas", icon: Workflow, component: CanvasStep },
  { id: 7, title: "Deploy", icon: Rocket, component: DeployStep },
];

const CreateAgent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agentData, setAgentData] = useState({});

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAgentData = (stepData: any) => {
    setAgentData(prev => ({ ...prev, ...stepData }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Steps */}
        <div className="w-80 bg-white border-r min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Agent</h2>
            <p className="text-gray-600 text-sm">Follow the steps to build your AI agent</p>
          </div>
          
          <div className="space-y-2">
            {steps.map((step, index) => (
              <StepIndicator
                key={step.id}
                step={step}
                isActive={currentStep === step.id}
                isCompleted={currentStep > step.id}
                onClick={() => setCurrentStep(step.id)}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-3">
                  {steps[currentStep - 1]?.icon && (
                    <steps[currentStep - 1].icon className="h-6 w-6 text-blue-600" />
                  )}
                  Step {currentStep}: {steps[currentStep - 1]?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    data={agentData}
                    onUpdate={updateAgentData}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isLastStep={currentStep === steps.length}
                  />
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={currentStep === steps.length}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === steps.length ? "Complete" : "Next"}
                {currentStep < steps.length && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
