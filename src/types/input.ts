export interface InputComponent {
  provider: string;
  component_type: "input";
  version: number;
  component_version: number;
  description: string;
  label: string;
  config: {
    [key: string]: any;
  };
}

export interface InputBase {
  component: InputComponent;
  organization_id?: string;
}

export interface InputCreate extends InputBase {}
export interface InputUpdate extends InputBase {}

export interface InputResponse extends InputBase {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface InputList {
  items: InputResponse[];
  total: number;
  page: number;
  pages: number;
  size: number;
}

export interface InputFilters {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  name?: string;
  name_like?: string;
  is_active?: boolean;
}