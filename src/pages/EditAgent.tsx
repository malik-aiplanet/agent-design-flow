import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, User, Users, Settings, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

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

// Mock data for existing agent
const mockAgentData = {
  name: "Customer Support Agent",
  description: "Handles customer inquiries and support tickets with intelligent routing and escalation",
  model: "GPT-4",
  status: "Active",
  tools: ["task-actions", "media"],
  systemPrompt: "You are a helpful customer support agent..."
};

const EditAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  // Get team data from router state or use mock data as fallback
  const teamData = location.state?.teamData;
  const initialData = teamData ? {
    name: teamData.name,
    description: teamData.description,
    teamType: teamData.teamType,
    status: teamData.status,
    participantsCount: teamData.participantsCount,
    maxTurns: teamData.maxTurns,
    lastModified: teamData.lastModified
  } : mockAgentData;

  const [agentData, setAgentData] = useState(initialData);

  useEffect(() => {
    console.log("Editing team with ID:", id);
    console.log("Team data:", teamData);
  }, [id, teamData]);

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

  const handleSave = () => {
    console.log("Saving agent data:", agentData);
    navigate("/");
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
                <h1 className="text-lg font-semibold text-gray-900">
                  {teamData ? "Edit Team" : "Edit Agent"}
                </h1>
                <p className="text-sm text-gray-500">{agentData.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const IconComponent = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted
                      ? "bg-green-100 border-green-500"
                      : isActive
                      ? "bg-white border-white"
                      : "border-gray-300"
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <IconComponent className={`h-4 w-4 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      isActive ? "text-white" : isCompleted ? "text-green-700" : "text-gray-700"
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs ${
                      isActive ? "text-blue-100" : isCompleted ? "text-green-600" : "text-gray-500"
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
                data={agentData}
                onUpdate={setAgentData}
                onNext={nextStep}
                onPrev={prevStep}
                isEditMode={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-2 h-10 text-sm border-gray-300"
          >
            Cancel
          </Button>

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
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm"
              >
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm"
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

export default EditAgent;
