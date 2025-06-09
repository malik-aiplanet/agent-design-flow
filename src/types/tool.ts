export interface ToolConfig {
  component_type: "tool";
  component_version: number;
  config: {
    description: string;
    global_imports: string[];
    has_cancellation_support: boolean;
    name: string;
    source_code: string;
  };
  description: string;
  label: string;
  provider: string;
  version: number;
}

export interface Tool {
  id: string;
  component: ToolConfig;
  organization_id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// Frontend display type (for UI components)
export interface Tool2 {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  lastModified: string;
  provider: string;
  label: string;
}

export interface ToolCreate {
  component: ToolConfig;
  organization_id?: string;
}

export interface ToolUpdate {
  component?: Partial<ToolConfig>;
}

export interface ToolResponse extends Tool {}

export interface ToolList {
  items: ToolResponse[];
  total: number;
  page: number;
  pages: number;
  size: number;
}

export interface ToolFilters {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  name?: string;
  name_like?: string;
  is_active?: boolean;
}