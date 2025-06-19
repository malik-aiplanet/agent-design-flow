// Base component structure that all components follow
export interface BaseComponent {
  provider: string;
  component_type: string;
  version: number;
  component_version: number;
  description: string;
  label: string;
}

// Model client component
export interface ModelComponent extends BaseComponent {
  component_type: "model";
  config: {
    model: string;
    api_key: string;
    [key: string]: any;
  };
}



// Model context component
export interface ModelContextComponent extends BaseComponent {
  component_type: "chat_completion_context";
  config: Record<string, any>;
}

// Handoff configuration
export interface HandoffConfig {
  target: string;
  description: string;
  name: string;
  message: string;
}

// Agent component (participant in teams)
export interface AgentComponent extends BaseComponent {
  component_type: "agent";
  config: {
    name: string;
    description: string;
    system_message?: string;
    model_client?: ModelComponent;
    tools?: any[];
    handoffs?: HandoffConfig[];
    model_context?: ModelContextComponent;
    model_client_stream?: boolean;
    reflect_on_tool_use?: boolean;
    tool_call_summary_format?: string;
    metadata?: Record<string, any>;
  };
}

// Team component configuration (this is what the builder endpoint returns)
export interface TeamComponent extends BaseComponent {
  component_type: "team";
  config: {
    participants: AgentComponent[];
    max_turns: number;
    emit_team_events: boolean;
    // SelectorGroupChat specific fields
    model_client?: ModelComponent;
    selector_prompt?: string;
    allow_repeated_speaker?: boolean;
    max_selector_attempts?: number;
    model_client_streaming?: boolean;
  };
}

// API request/response types
export interface TeamCreateRequest {
  component: TeamComponent;
  organization_id?: string;
  model_id?: string;
  team_agent_ids?: string[];
  team_input_ids?: string[];
  team_output_ids?: string[];
  team_termination_condition_ids?: string[];
}

export interface TeamResponse {
  id: string;
  component: TeamComponent;
  organization_id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// UI state types (separate from API types)
export interface WorkflowUIState {
  // Step 1: Workflow Details
  name?: string;
  description?: string;

  // Step 2: Sub Agents
  customAgents?: AgentComponent[];
  selectedAgents?: any[];

  // Step 3: IO Configuration
  selectedInputIds?: string[];
  selectedOutputIds?: string[];
  team_input_ids?: string[];  // for backend payload
  team_output_ids?: string[]; // for backend payload

  // Step 4: Team Configuration (moved from step 3)
  selectedTeamType?: string;
  availableTeamTemplates?: TeamComponent[];
  teamConfiguration?: TeamComponent;

  // Step 5: Deploy (moved from step 4)
  deploymentConfig?: any;
  deploymentComplete?: boolean;
  teamId?: string;
}

// List and filter types
export interface TeamListResponse {
  items: TeamResponse[];
  total: number;
  page: number;
  pages: number;
  size: number;
}

export interface TeamFilters {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  name?: string;
  name_like?: string;
  is_active?: boolean;
}

// Legacy types for backward compatibility (can be removed later)
export interface Team extends TeamResponse {}
export interface TeamCreate extends TeamCreateRequest {}
export interface TeamUpdate {
  component: Partial<TeamComponent>;
  organization_id?: string;
  model_id?: string;
  team_agent_ids?: string[];
  team_input_ids?: string[];
  team_output_ids?: string[];
  team_termination_condition_ids?: string[];
}
export interface TeamList extends TeamListResponse {}

// UI display type for frontend components
export interface Team2 {
  id: string;
  name: string;
  description: string;
  teamType: string;
  status: "Active" | "Inactive";
  lastModified: string;
  participantsCount: number;
  maxTurns: number;
}

// Helper types for team type identification
export type TeamType =
  | "autogen_agentchat.teams.RoundRobinGroupChat"
  | "autogen_agentchat.teams.SelectorGroupChat"
  | "autogen_agentchat.teams.Swarm";

export interface TeamTypeInfo {
  name: string;
  description: string;
  icon: string;
  complexity: 'Simple' | 'Medium' | 'Advanced';
  requiresModelClient: boolean;
  requiresSelectorPrompt: boolean;
}

export const TEAM_TYPE_INFO: Record<TeamType, TeamTypeInfo> = {
  "autogen_agentchat.teams.RoundRobinGroupChat": {
    name: "Round Robin Group Chat",
    description: "Participants take turns in a round-robin fashion to publish messages",
    icon: "🔄",
    complexity: "Simple",
    requiresModelClient: false,
    requiresSelectorPrompt: false,
  },
  "autogen_agentchat.teams.SelectorGroupChat": {
    name: "Selector Group Chat",
    description: "Uses AI to intelligently select the next speaker after each message",
    icon: "🎯",
    complexity: "Advanced",
    requiresModelClient: true,
    requiresSelectorPrompt: true,
  },
  "autogen_agentchat.teams.Swarm": {
    name: "Swarm",
    description: "Selects next speaker based on handoff messages only",
    icon: "🐝",
    complexity: "Medium",
    requiresModelClient: false,
    requiresSelectorPrompt: false,
  },
};

// Add deployment and testing interfaces
export interface TeamDeployResponse {
  success: boolean;
  message?: string;
  deployment_id?: string;
}

export interface TeamTestRequest {
  test_input?: any;
  max_iterations?: number;
  timeout?: number;
}

export interface TeamTestResponse {
  success: boolean;
  result?: any;
  logs?: string[];
  execution_time?: number;
}