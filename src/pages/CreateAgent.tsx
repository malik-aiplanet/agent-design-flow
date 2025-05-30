
import { useState } from "react";
import { ChevronRight, Users, Bot, Brain, Wrench, FileText, Workflow, Rocket, ArrowLeft, Save } from "lucide-react";
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
import { Link } from "react-router-dom";

const steps = [
  { id: 1, title: "Team", icon: Users, component: TeamStep, description: "Configure basic details and team settings" },
  { id: 2, title: "Agent", icon: Bot, component: AgentStep, description: "Define agent behavior and personality" },
  { id: 3, title: "Model", icon: Brain, component: ModelStep, description: "Select and configure AI models" },
  { id: 4, title: "Tools", icon: Wrench, component: ToolsStep, description: "Add tools and integrations" },
  { id: 5, title: "Output", icon: FileText, component: OutputStep, description: "Configure response formats" },
  { id: 6, title: "Canvas", icon: Workflow, component: CanvasStep, description: "Visual workflow design" },
  { id: 7, title: "Deploy", icon: Rocket, component: DeployStep, description: "Deploy and activate your agent" },
];

const CreateAgent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agentData, setAgentData] = useState({});

  const CurrentStepComponent = steps[currentStep - 1]?.component;
  const CurrentStepIcon = steps[currentStep - 1]?.icon;
  const currentStepInfo = steps[currentStep - 1];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Sidebar - Steps */}
      <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-8 shadow-sm">
        {/* Header with back button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Create Agent</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Follow the steps to build your intelligent AI agent</p>
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

        {/* Progress indicator */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-12 pb-32">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
              <CardHeader className="border-b border-gray-100 pb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-4">
                  {CurrentStepIcon && (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <CurrentStepIcon className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      Step {currentStep}: {currentStepInfo?.title}
                    </div>
                    <div className="text-sm text-gray-600 font-normal mt-1">
                      {currentStepInfo?.description} • {currentStep} of {steps.length}
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

        {/* Enhanced Navigation Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-8 shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 h-11 px-6 border-gray-300 hover:bg-gray-50"
              >
                ← Previous
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2 h-11 px-4 border-gray-300 hover:bg-gray-50"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </div>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 h-11 px-8 shadow-md"
            >
              {currentStep === steps.length ? "Deploy Agent" : "Continue"}
              {currentStep < steps.length && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
