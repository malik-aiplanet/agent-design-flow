// Model types matching backend schema
export interface ModelComponent {
  provider: string;
  component_type: "model";
  version: number;
  component_version: number;
  description: string;
  label: string;
  config: {
    model: string;
    [key: string]: any;
  };
}

export interface Model {
  id: string;
  component: ModelComponent;
  organization_id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// Frontend display type (similar to Agent2)
export interface Model2 {
  id: string;
  name: string;
  description: string;
  modelId: string;
  lastModified: string;
}

// API types
export interface ModelList {
  items: Model[];
  total: number;
  page: number;
  pages: number;
  size: number;
}

export interface ModelCreate {
  component: ModelComponent;
  organization_id?: string;
}

export interface ModelUpdate {
  component?: ModelComponent;
}

export interface ModelFilters {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  name?: string;
  name_like?: string;
  is_active?: boolean;
}