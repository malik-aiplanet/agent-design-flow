export interface OutputComponent {
  provider: string;
  component_type: "output";
  version: number;
  component_version: number;
  description: string;
  label: string;
  config: {
    [key: string]: any;
  };
}

export interface OutputBase {
  component: OutputComponent;
  organization_id?: string;
}

export interface OutputCreate extends OutputBase {}
export interface OutputUpdate extends OutputBase {}

export interface OutputResponse extends OutputBase {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface OutputList {
  items: OutputResponse[];
  total: number;
  page: number;
  pages: number;
  size: number;
}

export interface OutputFilters {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  name?: string;
  name_like?: string;
  is_active?: boolean;
}