
import { InputComponentCard } from "./team/InputComponentCard";
import { ModelSelectionCard } from "./team/ModelSelectionCard";
import { TerminationConditionCard } from "./team/TerminationConditionCard";
import { AgentsSelectionCard } from "./team/AgentsSelectionCard";
import { OutputFormatCard } from "./team/OutputFormatCard";
import { ToolsSelectionCard } from "./team/ToolsSelectionCard";
import { SystemPromptCard } from "./team/SystemPromptCard";

export const TeamStep = ({
  data,
  onUpdate
}: any) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-3">Team Configuration</h3>
        <p className="text-gray-600">Configure your agent team's model, behavior, and capabilities.</p>
      </div>

      {/* Input Components - First position */}
      <InputComponentCard />

      {/* Model & Termination */}
      <div className="grid grid-cols-2 gap-6">
        <ModelSelectionCard />
        <TerminationConditionCard />
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
