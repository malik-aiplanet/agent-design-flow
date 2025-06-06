// Base types for agent component structure
export interface ComponentConfig {
  [key: string]: any;
}

export interface Component {
  provider: string;
  component_type: string;
  version: number;
  component_version: number;
  description: string;
  label: string;
  config: ComponentConfig;
}

// Model config types
export interface ModelConfig extends Component {
  component_type: "model";
}

// Agent config types
export interface AgentConfig extends Component {
  component_type: "agent";
  config: {
    name: string;
    model_client: ModelConfig;
    workbench: Component;
    model_context: Component;
    description: string;
    system_message: string;
    model_client_stream: boolean;
    reflect_on_tool_use: boolean;
    tool_call_summary_format: string;
    metadata: Record<string, any>;
  };
}

// Agent entity from backend
export interface Agent {
  id: string;
  name: string;
  description: string;
  component: AgentConfig;
  organization_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// Agent list response
export interface AgentList {
  items: Agent[];
  total: number;
  page: number;
  pages: number;
  size: number;
}

// Agent creation payload
export interface AgentCreate {
  name: string;
  description: string;
  component: AgentConfig;
}

// Agent update payload
export interface AgentUpdate {
  name?: string;
  description?: string;
  component?: AgentConfig;
  is_active?: boolean;
}

// Response from agent API
export interface AgentResponse extends Agent {}

// Frontend display types (for UI components)
export interface Agent2 {
  id: string;
  name: string;
  description: string;
  modelClient: string;
  status: "Active" | "Inactive";
  lastModified: string;
  toolsCount: number;
}