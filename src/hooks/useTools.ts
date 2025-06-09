import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toolsApi } from '../api/tools'
import { ToolCreate, ToolUpdate, Tool2, ToolFilters } from '../types/tool'
import { formatRelativeTime } from '../lib/datetime'

// Utility function to transform backend Tool to frontend Tool2 format
const transformToolToTool2 = (tool: any): Tool2 => {
  const config = tool.component?.config;

  // Determine if tool is active based on deletion status
  const isActive = !tool.is_deleted;

  // Select the most recent date (updated_at or created_at as fallback)
  const dateToFormat = tool.updated_at || tool.created_at;
  const lastModified = formatRelativeTime(dateToFormat);

  return {
    id: tool.id,
    name: config?.name || 'Unnamed Tool', // name is in component.config.name
    description: config?.description || 'No description', // description is in component.config.description
    status: isActive ? "Active" : "Inactive",
    lastModified,
    provider: tool.component?.provider || 'Unknown Provider',
    label: tool.component?.label || 'Unknown Tool',
  }
}

export const useTools = (params?: ToolFilters) => {
  return useQuery({
    queryKey: ['tools', params],
    queryFn: () => toolsApi.getAll(params),
    placeholderData: keepPreviousData,
    select: (data) => ({
      ...data,
      items: data.items.map(transformToolToTool2)
    })
  })
}

export const useTool = (id: string) => {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: () => toolsApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ToolCreate) => toolsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}

export const useUpdateTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ToolUpdate }) =>
      toolsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      queryClient.invalidateQueries({ queryKey: ['tool', id] })
    },
  })
}

export const useDeleteTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      toolsApi.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}

export const useRestoreTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => toolsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}