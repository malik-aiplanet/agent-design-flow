
import { ModelSelectionCard } from "./team/ModelSelectionCard";
import { MultiSelectTerminationCard } from "./team/MultiSelectTerminationCard";
import { AgentsSelectionCard } from "./team/AgentsSelectionCard";
import { OutputFormatCard } from "./team/OutputFormatCard";
import { ToolsSelectionCard } from "./team/ToolsSelectionCard";
import { SystemPromptCard } from "./team/SystemPromptCard";
import { InputComponentCard } from "./team/InputComponentCard";

export const TeamStep = ({
  data,
  onUpdate
}: any) => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">Team Configuration</h3>
        <p className="text-gray-600 text-lg">Configure team settings, input components, and administrative options for your agent deployment.</p>
      </div>

      {/* Input Components - First Item */}
      <InputComponentCard />

      {/* Model & Termination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelSelectionCard />
        <MultiSelectTerminationCard />
      </div>

      {/* Agents */}
      <AgentsSelectionCard />

      {/* Output Format */}
      <OutputFormatCard />

      {/* Tools */}
      <ToolsSelectionCard />

      {/* System Prompt */}
      <SystemPromptCard />
    </div>
  );
};
