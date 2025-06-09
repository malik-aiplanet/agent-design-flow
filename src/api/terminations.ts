import { ApiService } from '../lib/api'
import {
  TerminationConditionList,
  TerminationConditionResponse,
  TerminationConditionCreate,
  TerminationConditionUpdate,
  TerminationConditionFilters
} from '../types/termination'

export const terminationsApi = {
  getAll: (params?: TerminationConditionFilters): Promise<TerminationConditionList> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params?.name) searchParams.append('name', params.name);
    if (params?.name_like) searchParams.append('name_like', params.name_like);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const url = `/private/termination_conditions${queryString ? `?${queryString}` : ''}`;

    return ApiService.get<TerminationConditionList>(url);
  },

  getById: (id: string): Promise<TerminationConditionResponse> => {
    return ApiService.get<TerminationConditionResponse>(`/private/termination_conditions/${id}`);
  },

  create: (data: TerminationConditionCreate): Promise<TerminationConditionResponse> => {
    return ApiService.post<TerminationConditionResponse>('/private/termination_conditions', data);
  },

  update: (id: string, data: TerminationConditionUpdate): Promise<TerminationConditionResponse> => {
    return ApiService.put<TerminationConditionResponse>(`/private/termination_conditions/${id}`, data);
  },

  delete: (id: string, permanent = false): Promise<{ success: boolean }> => {
    const url = `/private/termination_conditions/${id}${permanent ? '?permanent=true' : ''}`;
    return ApiService.delete<{ success: boolean }>(url);
  },

  restore: (id: string): Promise<TerminationConditionResponse> => {
    return ApiService.post<TerminationConditionResponse>(`/private/termination_conditions/${id}/restore`);
  },
}