import { useState } from "react";
import { ArrowUpDown, ArrowDownRight, Plus, Settings, Loader2, Check, X, FileText, Upload, Link, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useInputs } from "@/hooks/useInputs";
import { useOutputs } from "@/hooks/useOutputs";
import { InputResponse } from "@/types/input";
import { OutputResponse } from "@/types/output";

interface InputComponent {
  id: string;
  inputId: string;
  enabled: boolean;
}

interface IOStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isValid?: boolean;
}

export const IOStep = ({ data, onUpdate, isValid }: IOStepProps) => {
  // Initialize with one input by default
  const [inputComponents, setInputComponents] = useState<InputComponent[]>(
    data?.inputComponents || [{
      id: "1",
      inputId: "",
      enabled: true,
    }]
  );
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(
    data?.selectedOutputIds?.[0] || data?.selectedOutputId || null
  );

  // Fetch available inputs and outputs from backend
  const { data: inputsData, isLoading: inputsLoading, error: inputsError } = useInputs({
    is_active: true,
    limit: 100
  });

  const { data: outputsData, isLoading: outputsLoading, error: outputsError } = useOutputs({
    is_active: true,
    limit: 100
  });

  const inputs = inputsData?.items || [];
  const outputs = outputsData?.items || [];

  const handleInputComponentUpdate = (updatedInputComponents: InputComponent[]) => {
    setInputComponents(updatedInputComponents);

    // Extract the selected input IDs for validation and payload
    const selectedInputIds = updatedInputComponents
      .filter(component => component.inputId && component.enabled)
      .map(component => component.inputId);

    onUpdate?.({
      ...data,
      inputComponents: updatedInputComponents,
      selectedInputIds: selectedInputIds,
      team_input_ids: selectedInputIds // for backend payload
    });
  };

  const addInputComponent = () => {
    const newInputComponent: InputComponent = {
      id: Date.now().toString(),
      inputId: "",
      enabled: true,
    };
    handleInputComponentUpdate([...inputComponents, newInputComponent]);
  };

  const removeInputComponent = (id: string) => {
    handleInputComponentUpdate(inputComponents.filter(component => component.id !== id));
  };

  const updateInputComponent = (id: string, field: string, value: any) => {
    const updatedComponents = inputComponents.map(component =>
      component.id === id ? { ...component, [field]: value } : component
    );
    handleInputComponentUpdate(updatedComponents);
  };

  const handleOutputSelection = (outputId: string) => {
    const newSelectedId = selectedOutputId === outputId ? null : outputId;
    setSelectedOutputId(newSelectedId);

    onUpdate?.({
      ...data,
      selectedOutputId: newSelectedId,
      selectedOutputIds: newSelectedId ? [newSelectedId] : [], // for backward compatibility
      team_output_ids: newSelectedId ? [newSelectedId] : [] // for backend payload
    });
  };

  const isLoading = inputsLoading || outputsLoading;
  const hasError = inputsError || outputsError;

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ArrowUpDown className="h-5 w-5 text-white" />
            </div>
            Input & Output Configuration
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Configure how your workflow receives input data and formats its output responses.
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Loading available inputs and outputs...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ArrowUpDown className="h-5 w-5 text-white" />
            </div>
            Input & Output Configuration
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Configure how your workflow receives input data and formats its output responses.
          </p>
        </div>
        <div className="text-center py-20">
          <div className="text-red-600 text-xl font-semibold mb-3">Error loading I/O components</div>
          <p className="text-slate-400 mb-8 text-base">
            {(inputsError as any)?.message || (outputsError as any)?.message || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ArrowUpDown className="h-5 w-5 text-white" />
          </div>
          Input & Output Configuration
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          Configure how your workflow receives input data and formats its output responses.
          Select from available input and output components that have been configured in your organization.
        </p>
      </div>

      {/* Inputs Section */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 text-blue-600" />
            </div>
            Input Components
            <Badge variant="secondary">
              {inputComponents.filter(component => component.inputId && component.enabled).length} configured
            </Badge>
          </CardTitle>
          <Button onClick={addInputComponent} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Input
          </Button>
        </CardHeader>
        <CardContent>
          {inputs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No input components available.</p>
              <p className="text-sm text-gray-400">Contact your administrator to set up input components.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inputComponents.map((inputComponent) => {
                const selectedInput = inputs.find(input => input.id === inputComponent.inputId);
                return (
                  <div
                    key={inputComponent.id}
                    className="border rounded-lg p-4 transition-all hover:shadow-md bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <ArrowDownRight className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Input Type</Label>
                          <Select
                            value={inputComponent.inputId}
                            onValueChange={(value) => updateInputComponent(inputComponent.id, "inputId", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select input type" />
                            </SelectTrigger>
                            <SelectContent>
                              {inputs.map((input: InputResponse) => (
                                <SelectItem key={input.id} value={input.id}>
                                  {input.component.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end justify-between">
                          {inputComponents.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInputComponent(inputComponent.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Show input details when selected */}
                    {selectedInput && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{selectedInput.component.label}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{selectedInput.component.description}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outputs Section */}
      <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-green-600" />
            </div>
            Output Components
            <Badge variant="secondary">{selectedOutputId ? '1 selected' : 'none selected'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {outputs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No output components available.</p>
              <p className="text-sm text-gray-400">Contact your administrator to set up output components.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {outputs.map((output: OutputResponse) => (
                <div
                  key={output.id}
                  className={`border rounded-lg p-3 transition-all hover:shadow-md cursor-pointer aspect-square flex items-center justify-center ${
                    selectedOutputId === output.id
                      ? "border-green-800 bg-green-800"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => handleOutputSelection(output.id)}
                >
                  <h4 className={`font-medium text-xs text-center leading-tight ${
                    selectedOutputId === output.id ? "text-white" : "text-gray-900"
                  }`}>{output.component.label}</h4>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs font-bold">!</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-amber-800">I/O Configuration Best Practices</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Configure at least one input component to receive data</li>
                <li>• Choose output components that work with your downstream systems</li>
                <li>• You can add multiple input components for different data sources</li>
                <li>• Review component configurations to ensure they meet your requirements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      {!isValid && (
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-800">Configuration Required</h4>
                <p className="text-xs text-red-700">
                  Please configure at least one input component and select one output component to proceed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};