import { ApiService } from '../lib/api'
import {
  InputList,
  InputCreate,
  InputUpdate,
  InputResponse,
  InputFilters
} from '../types/input'

export const inputsApi = {
  getAll: (params?: InputFilters): Promise<InputList> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params?.name) searchParams.append('name', params.name);
    if (params?.name_like) searchParams.append('name_like', params.name_like);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const url = `/private/inputs${queryString ? `?${queryString}` : ''}`;

    return ApiService.get<InputList>(url);
  },

  getById: (id: string): Promise<InputResponse> => {
    return ApiService.get<InputResponse>(`/private/inputs/${id}`);
  },

  create: (data: InputCreate): Promise<InputResponse> => {
    return ApiService.post<InputResponse>('/private/inputs', data);
  },

  update: (id: string, data: InputUpdate): Promise<InputResponse> => {
    return ApiService.put<InputResponse>(`/private/inputs/${id}`, data);
  },

  delete: (id: string, permanent = false): Promise<{ success: boolean }> => {
    const url = `/private/inputs/${id}${permanent ? '?permanent=true' : ''}`;
    return ApiService.delete<{ success: boolean }>(url);
  },

  restore: (id: string): Promise<InputResponse> => {
    return ApiService.post<InputResponse>(`/private/inputs/${id}/restore`);
  },
}