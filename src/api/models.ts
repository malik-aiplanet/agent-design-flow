import { ApiService } from '../lib/api'
import { Model, ModelList, ModelCreate, ModelUpdate, ModelFilters } from '../types/model'

export const modelsApi = {
  getAll: (params?: ModelFilters): Promise<ModelList> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params?.name) searchParams.append('name', params.name);
    if (params?.name_like) searchParams.append('name_like', params.name_like);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const url = `/private/models${queryString ? `?${queryString}` : ''}`;

    return ApiService.get<ModelList>(url);
  },

  getById: (id: string): Promise<Model> => {
    return ApiService.get<Model>(`/private/models/${id}`);
  },

  create: (data: ModelCreate): Promise<Model> => {
    return ApiService.post<Model>('/private/models', data);
  },

  update: (id: string, data: ModelUpdate): Promise<Model> => {
    return ApiService.put<Model>(`/private/models/${id}`, data);
  },

  delete: (id: string, permanent = false): Promise<{ success: boolean }> => {
    const url = `/private/models/${id}${permanent ? '?permanent=true' : ''}`;
    return ApiService.delete<{ success: boolean }>(url);
  },

  restore: (id: string): Promise<Model> => {
    return ApiService.post<Model>(`/private/models/${id}/restore`);
  },
}