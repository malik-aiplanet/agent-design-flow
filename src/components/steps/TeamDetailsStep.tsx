import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bot, Users, Loader2 } from "lucide-react";
import { buildersApi } from "@/api/builders";
import { TeamComponent } from "@/types/team";
import { getTeamTypeIcon } from "@/lib/teamUtils";

export const teamDetailsStep = ({ data, onUpdate, isEditMode }: any) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamConfigs, setTeamConfigs] = useState<TeamComponent[]>([]);
  const [selectedTeamType, setSelectedTeamType] = useState("");
  const [loading, setLoading] = useState(true);

  // Initialize state from parent data
  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setSelectedTeamType(data.teamType || "");
    }
  }, [data]);

  // Fetch team configurations
  useEffect(() => {
    const fetchTeamConfigs = async () => {
      try {
        setLoading(true);
        const configs = await buildersApi.getTeamConfigs();
        setTeamConfigs(configs);
      } catch (error) {
        console.error("Failed to fetch team configs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamConfigs();
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    onUpdate?.({ ...data, name: value, description, teamType: selectedTeamType });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onUpdate?.({ ...data, name, description: value, teamType: selectedTeamType });
  };

  const handleTeamTypeChange = (teamType: string) => {
    setSelectedTeamType(teamType);
    // Reset all team configuration fields when team type changes
    // This ensures step 4 (TeamStep) will load fresh configuration for the new team type
    onUpdate?.({
      ...data,
      name,
      description,
      teamType,
      // Clear team configuration fields to force refresh in step 4
      teamConfig: undefined,
      selectedTeamTemplate: undefined,
      selectedModelId: undefined,
      selectedModel: undefined
    });
  };

  // Check if form is valid for navigation
  const isFormValid = name.trim() !== "" && selectedTeamType !== "";



  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Workflow Details" : "Workflow Details"}
        </h3>
        <p className="text-gray-600 text-lg">
          {isEditMode
            ? "Update your workflow's basic information and purpose."
            : "Configure your workflow's basic information and purpose. This forms the foundation of your workflow's configuration."
          }
        </p>
      </div>

      {/* Workflow Basics */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="workflow-name" className="text-sm font-medium text-gray-700">
              Workflow Name *
            </Label>
            <Input
              id="workflow-name"
              placeholder="e.g., Customer Onboarding Flow, Content Publishing Pipeline, Data Processing Workflow..."
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 overflow-ellipsis"
              maxLength={100}
            />
            <p className="text-xs text-gray-500">
              Give your workflow a descriptive and memorable name that reflects its purpose.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="workflow-description"
              placeholder="Describe what this workflow accomplishes, its main steps, and how it helps streamline processes..."
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="min-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              Provide a clear explanation of the workflow's purpose, main steps, and business value.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Type Selection */}
      <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            Workflow Type Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Choose Workflow Type *
            </Label>
            <p className="text-xs text-gray-500 mb-4">
              Select the type of workflow that best fits your use case. Each type has different coordination patterns and behaviors.
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading workflow types...</span>
              </div>
            ) : (
              <div className="grid gap-4">
                {teamConfigs.map((config, index) => {
                  const IconComponent = getTeamTypeIcon(config.label);
                  return (
                    <div
                      key={index}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedTeamType === config.label
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      onClick={() => handleTeamTypeChange(config.label)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{config.label}</h4>
                            {selectedTeamType === config.label && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {config.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {config.component_type}
                            </span>
                            <span className="text-xs text-gray-500">
                              v{config.version}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs font-bold">!</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-amber-800">Best Practices</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Use clear, descriptive names that indicate the workflow's function</li>
                <li>• Write descriptions that help users understand when to use this workflow</li>
                <li>• Choose the right workflow type: RoundRobin for sequential processing, Selector for dynamic coordination, Swarm for autonomous handoffs</li>
                <li>• Consider your target audience when crafting the description</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      {!isFormValid && (
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-800">Required Fields Missing</h4>
                <p className="text-xs text-red-700">
                  Please complete all required fields:
                  {!name.trim() && " Workflow Name"}
                  {!selectedTeamType && " Workflow Type"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
