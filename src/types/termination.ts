// Base types matching the backend schema structure
export interface TerminationConditionComponent {
  provider: string;
  component_type: string;
  version: number;
  component_version: number;
  description: string;
  label: string;
  config: Record<string, any>;
}

export interface TerminationConditionBase {
  component: TerminationConditionComponent;
  organization_id?: string;
}

export interface TerminationConditionCreate extends TerminationConditionBase {}

export interface TerminationConditionUpdate extends TerminationConditionBase {}

// Backend response types
export interface TerminationConditionResponse extends TerminationConditionBase {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface TerminationConditionList {
  items: TerminationConditionResponse[];
  total: number;
  page: number;
  pages: number;
  size: number;
}

// Frontend display type (transformed for UI) - no status field
export interface Termination2 {
  id: string;
  name: string;
  description: string;
  terminationType: string;
  lastModified: string;
  config: Record<string, any>;
  component: TerminationConditionComponent;
}

// Filters for API calls
export interface TerminationConditionFilters {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  name?: string;
  name_like?: string;
  is_active?: boolean;
}