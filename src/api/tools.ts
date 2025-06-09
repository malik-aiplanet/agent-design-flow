import { ApiService } from '../lib/api'
import {
  Tool,
  ToolList,
  ToolCreate,
  ToolUpdate,
  ToolResponse,
  ToolFilters
} from '../types/tool'



export const toolsApi = {
  getAll: (params?: ToolFilters): Promise<ToolList> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params?.name) searchParams.append('name', params.name);
    if (params?.name_like) searchParams.append('name_like', params.name_like);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const url = `/private/tools${queryString ? `?${queryString}` : ''}`;

    return ApiService.get<ToolList>(url);
  },

  getById: (id: string): Promise<ToolResponse> => {
    return ApiService.get<ToolResponse>(`/private/tools/${id}`);
  },

  create: (data: ToolCreate): Promise<ToolResponse> => {
    return ApiService.post<ToolResponse>('/private/tools', data);
  },

  update: (id: string, data: ToolUpdate): Promise<ToolResponse> => {
    return ApiService.put<ToolResponse>(`/private/tools/${id}`, data);
  },

  delete: (id: string, permanent = false): Promise<{ success: boolean }> => {
    const url = `/private/tools/${id}${permanent ? '?permanent=true' : ''}`;
    return ApiService.delete<{ success: boolean }>(url);
  },

  restore: (id: string): Promise<ToolResponse> => {
    return ApiService.post<ToolResponse>(`/private/tools/${id}/restore`);
  },
}