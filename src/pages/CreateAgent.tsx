
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, Bot, Brain, Wrench, Network, Users, FileOutput, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { StepIndicator } from "@/components/StepIndicator";

// Import all step components
import { AgentStep } from "@/components/steps/AgentStep";
import { ModelStep } from "@/components/steps/ModelStep";
import { ToolsStep } from "@/components/steps/ToolsStep";
import { CanvasStep } from "@/components/steps/CanvasStep";
import { TeamStep } from "@/components/steps/TeamStep";
import { OutputStep } from "@/components/steps/OutputStep";
import { DeployStep } from "@/components/steps/DeployStep";

const steps = [
  { id: 1, title: "Agent Type", component: AgentStep, icon: Bot },
  { id: 2, title: "Model", component: ModelStep, icon: Brain },
  { id: 3, title: "Tools", component: ToolsStep, icon: Wrench },
  { id: 4, title: "Canvas", component: CanvasStep, icon: Network },
  { id: 5, title: "Team", component: TeamStep, icon: Users },
  { id: 6, title: "Output", component: OutputStep, icon: FileOutput },
  { id: 7, title: "Deploy", component: DeployStep, icon: Rocket },
];

const CreateAgent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agentData, setAgentData] = useState({});

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-12 w-12 p-0 hover:bg-slate-100 rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Create New Agent</h1>
                <p className="text-slate-600 text-lg">Build your intelligent automation step by step</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <StepIndicator
                  step={step}
                  isActive={currentStep === step.id}
                  isCompleted={currentStep > step.id}
                  onClick={() => goToStep(step.id)}
                />
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-slate-200 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="p-10">
              <CurrentStepComponent 
                data={agentData} 
                onUpdate={setAgentData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="h-12 px-8 border border-slate-300 hover:bg-slate-50 font-medium disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-slate-500 font-medium text-lg">
              Step {currentStep} of {steps.length}
            </div>
            
            {currentStep === steps.length ? (
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 font-medium"
              >
                <Check className="h-4 w-4 mr-2" />
                Complete Setup
              </Button>
            ) : (
              <Button 
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 font-medium"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
