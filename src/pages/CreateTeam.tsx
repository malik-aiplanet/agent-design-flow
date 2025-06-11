import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, User, Users, Wrench, Settings, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Import all step components
import { teamDetailsStep } from "@/components/steps/TeamDetailsStep";
import { SubAgentsStep } from "@/components/steps/SubAgentsStep";
import { TeamStep } from "@/components/steps/TeamStep";
import { DeployStep } from "@/components/steps/DeployStep";

const steps = [
  { id: 1, title: "Workflow Details", component: teamDetailsStep, icon: User },
  { id: 2, title: "Sub Agents", component: SubAgentsStep, icon: Users },
  { id: 3, title: "Team", component: TeamStep, icon: Settings },
  { id: 4, title: "Deploy", component: DeployStep, icon: Rocket },
];

const CreateTeam = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [teamData, setTeamData] = useState<any>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Validation functions for each step
  const validateStep1 = (data: any): boolean => {
    return !!(data?.name?.trim() && data?.teamType);
  };

  const validateStep2 = (data: any): boolean => {
    return !!(data?.selectedAgents?.length > 0);
  };

  const validateStep3 = (data: any): boolean => {
    // Basic validation: should have team config and if it's SelectorGroupChat, should have model
    if (!data?.teamConfig) return false;

    // If it's a SelectorGroupChat, require model selection
    if (data?.selectedTeamTemplate?.provider === "autogen_agentchat.teams.SelectorGroupChat") {
      return !!(data?.selectedModelId || data?.teamConfig?.model_client);
    }

    // For other team types, basic config is sufficient
    return true;
  };

  const validateStep4 = (data: any): boolean => {
    // Deploy step is complete when workflow has been successfully created/deployed
    return !!(data?.deploymentComplete || data?.teamId);
  };

  // Check if a step is completed (all required fields filled)
  const isStepCompleted = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return validateStep1(teamData);
      case 2:
        return validateStep2(teamData);
      case 3:
        return validateStep3(teamData);
      case 4:
        return validateStep4(teamData);
      default:
        return false;
    }
  };

  // Check if user can proceed to next step
  const canProceedToNextStep = (): boolean => {
    return isStepCompleted(currentStep);
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (!canProceedToNextStep()) {
      // Scroll to top to show validation messages
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setMaxStepReached(Math.max(maxStepReached, newStep));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId: number) => {
    // Allow access to any step that has been reached before, or the next step if current step is valid
    if (stepId <= maxStepReached || (stepId === currentStep + 1 && canProceedToNextStep())) {
      setCurrentStep(stepId);
      setMaxStepReached(Math.max(maxStepReached, stepId));
    }
  };

  const updateWorkflowData = (newData: any) => {
    setTeamData(prev => ({ ...prev, ...newData }));
    setHasUnsavedChanges(true);
  };

  const saveChanges = () => {
    // Could implement local storage or draft saving here
    console.log("Saving workflow data:", teamData);
    setHasUnsavedChanges(false);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 flex pb-20">
      {/* Vertical Step Sidebar - Made Sticky */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Create Workflow</h1>
                <p className="text-sm text-gray-500">Step by step setup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = isStepCompleted(step.id);
              const isAccessible = step.id <= maxStepReached || (step.id === currentStep + 1 && canProceedToNextStep());
              const IconComponent = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  disabled={!isAccessible}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : isAccessible
                          ? "text-gray-600 hover:bg-gray-100"
                          : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted
                      ? "bg-green-100 border-green-500"
                      : isActive
                        ? "bg-white border-white"
                        : isAccessible
                          ? "border-gray-300"
                          : "border-gray-200"
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <IconComponent className={`h-4 w-4 ${
                        isActive
                          ? "text-blue-600"
                          : isAccessible
                            ? "text-gray-400"
                            : "text-gray-300"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      isActive
                        ? "text-white"
                        : isCompleted
                          ? "text-green-700"
                          : isAccessible
                            ? "text-gray-700"
                            : "text-gray-400"
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs ${
                      isActive
                        ? "text-blue-100"
                        : isCompleted
                          ? "text-green-600"
                          : isAccessible
                            ? "text-gray-500"
                            : "text-gray-300"
                    }`}>
                      Step {step.id} of {steps.length}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <CurrentStepComponent
                data={teamData}
                onUpdate={updateWorkflowData}
                onNext={nextStep}
                onPrev={prevStep}
                onSave={saveChanges}
                hasUnsavedChanges={hasUnsavedChanges}
                isValid={isStepCompleted(currentStep)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-end">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-2 h-10 text-sm disabled:opacity-50 border-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm"
                disabled={!isStepCompleted(currentStep)}
              >
                <Check className="h-4 w-4" />
                Complete
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm disabled:opacity-50"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
