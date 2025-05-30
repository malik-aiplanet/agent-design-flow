
import { useState } from "react";
import { ChevronRight, Users, Bot, Brain, Wrench, FileText, Workflow, Rocket } from "lucide-react";
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
  const CurrentStepIcon = steps[currentStep - 1]?.icon;

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Steps */}
      <div className="w-80 bg-white border-r min-h-screen p-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Create Agent</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Follow the steps to build your AI agent</p>
        </div>
        
        <div className="space-y-3">
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
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-12 pb-32">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-6">
                <CardTitle className="flex items-center gap-4 text-xl">
                  {CurrentStepIcon && (
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CurrentStepIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="text-xl font-semibold text-gray-900">
                      Step {currentStep}: {steps[currentStep - 1]?.title}
                    </div>
                    <div className="text-sm text-gray-500 font-normal mt-1">
                      {currentStep} of {steps.length}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-12">
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
          </div>
        </div>

        {/* Sticky Navigation Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-8">
          <div className="max-w-5xl mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 h-11 px-6 border-gray-300"
            >
              ← Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 h-11 px-6"
            >
              {currentStep === steps.length ? "Complete" : "Next"}
              {currentStep < steps.length && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
