import { ApiService } from '../lib/api';
import {
  TeamCreateRequest,
  TeamUpdate,
  TeamResponse,
  TeamListResponse,
  TeamFilters
} from '../types/team';

// Add new interfaces for deployment and testing
export interface TeamDeployResponse {
  success: boolean;
  message?: string;
  deployment_id?: string;
}

export interface TeamTestRequest {
  test_input?: any;
  max_iterations?: number;
  timeout?: number;
}

export interface TeamTestResponse {
  success: boolean;
  result?: any;
  logs?: string[];
  execution_time?: number;
}

export const teamsApi = {
  getAll: (params?: TeamFilters): Promise<TeamListResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params?.name) searchParams.append('name', params.name);
    if (params?.name_like) searchParams.append('name_like', params.name_like);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const url = `/private/teams${queryString ? `?${queryString}` : ''}`;

    return ApiService.get<TeamListResponse>(url);
  },

  getById: (id: string): Promise<TeamResponse> => {
    return ApiService.get<TeamResponse>(`/private/teams/${id}`);
  },

  create: (data: TeamCreateRequest): Promise<TeamResponse> => {
    return ApiService.post<TeamResponse>('/private/teams', data);
  },

  update: (id: string, data: TeamUpdate): Promise<TeamResponse> => {
    return ApiService.put<TeamResponse>(`/private/teams/${id}`, data);
  },

  delete: (id: string, permanent = false): Promise<{ success: boolean }> => {
    const url = `/private/teams/${id}${permanent ? '?permanent=true' : ''}`;
    return ApiService.delete<{ success: boolean }>(url);
  },

  restore: (id: string): Promise<TeamResponse> => {
    return ApiService.post<TeamResponse>(`/private/teams/${id}/restore`);
  },

  // New deployment and testing methods
  deploy: (id: string): Promise<TeamDeployResponse> => {
    return ApiService.post<TeamDeployResponse>(`/private/teams/${id}/deploy`);
  },

  undeploy: (id: string): Promise<TeamDeployResponse> => {
    return ApiService.post<TeamDeployResponse>(`/private/teams/${id}/stop-deployment`);
  },

  test: (id: string, testData?: TeamTestRequest): Promise<TeamTestResponse> => {
    return ApiService.post<TeamTestResponse>(`/private/teams/${id}/test`, testData);
  },
};