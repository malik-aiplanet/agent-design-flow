
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
  const [currentStep, setCurrentStep] = useState(6); // Start on Canvas step to show the new workflow
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar - Steps */}
      <div className="w-80 bg-white border-r border-slate-200 min-h-screen p-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Create Agent</h2>
          <p className="text-slate-600 text-sm leading-relaxed">Follow the steps to build your intelligent AI agent</p>
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
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">
          <div className="max-w-none mx-auto h-full">
            <Card className="bg-white border-slate-200 overflow-hidden h-full">
              <CardHeader className="border-b border-slate-200 pb-6 bg-blue-50">
                <CardTitle className="flex items-center gap-4">
                  {CurrentStepIcon && (
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                      <CurrentStepIcon className="h-6 w-6 text-blue-700" />
                    </div>
                  )}
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      Step {currentStep}: {currentStepInfo?.title}
                    </div>
                    <div className="text-sm text-slate-600 font-normal mt-1">
                      {currentStepInfo?.description} • {currentStep} of {steps.length}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                {CurrentStepComponent && (
                  <div className="h-full">
                    <CurrentStepComponent
                      data={agentData}
                      onUpdate={updateAgentData}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      isLastStep={currentStep === steps.length}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Navigation Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6">
          <div className="max-w-none mx-auto flex justify-between">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 h-11 px-6 border-slate-300 hover:bg-slate-50"
              >
                ← Previous
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2 h-11 px-4 border-slate-300 hover:bg-slate-50"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </div>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 h-11 px-8"
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
