import { ApiService } from '../lib/api'
import {
  OutputList,
  OutputCreate,
  OutputUpdate,
  OutputResponse,
  OutputFilters
} from '../types/output'

export const outputsApi = {
  getAll: (params?: OutputFilters): Promise<OutputList> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params?.name) searchParams.append('name', params.name);
    if (params?.name_like) searchParams.append('name_like', params.name_like);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const url = `/private/outputs${queryString ? `?${queryString}` : ''}`;

    return ApiService.get<OutputList>(url);
  },

  getById: (id: string): Promise<OutputResponse> => {
    return ApiService.get<OutputResponse>(`/private/outputs/${id}`);
  },

  create: (data: OutputCreate): Promise<OutputResponse> => {
    return ApiService.post<OutputResponse>('/private/outputs', data);
  },

  update: (id: string, data: OutputUpdate): Promise<OutputResponse> => {
    return ApiService.put<OutputResponse>(`/private/outputs/${id}`, data);
  },

  delete: (id: string, permanent = false): Promise<{ success: boolean }> => {
    const url = `/private/outputs/${id}${permanent ? '?permanent=true' : ''}`;
    return ApiService.delete<{ success: boolean }>(url);
  },

  restore: (id: string): Promise<OutputResponse> => {
    return ApiService.post<OutputResponse>(`/private/outputs/${id}/restore`);
  },
}