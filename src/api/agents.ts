import { ApiService } from '../lib/api'
import {
  Agent,
  AgentList,
  AgentCreate,
  AgentUpdate,
  AgentResponse
} from '../types/agent'

export interface AgentFilters {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  name?: string;
  name_like?: string;
  is_active?: boolean;
}

export const agentsApi = {
  getAll: (params?: AgentFilters): Promise<AgentList> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params?.name) searchParams.append('name', params.name);
    if (params?.name_like) searchParams.append('name_like', params.name_like);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const url = `/private/agents${queryString ? `?${queryString}` : ''}`;

    return ApiService.get<AgentList>(url);
  },

  getById: (id: string): Promise<AgentResponse> => {
    return ApiService.get<AgentResponse>(`/private/agents/${id}`);
  },

  create: (data: AgentCreate): Promise<AgentResponse> => {
    return ApiService.post<AgentResponse>('/private/agents', data);
  },

  update: (id: string, data: AgentUpdate): Promise<AgentResponse> => {
    return ApiService.put<AgentResponse>(`/private/agents/${id}`, data);
  },

  delete: (id: string, permanent = false): Promise<{ success: boolean }> => {
    const url = `/private/agents/${id}${permanent ? '?permanent=true' : ''}`;
    return ApiService.delete<{ success: boolean }>(url);
  },

  restore: (id: string): Promise<AgentResponse> => {
    return ApiService.post<AgentResponse>(`/private/agents/${id}/restore`);
  },
}