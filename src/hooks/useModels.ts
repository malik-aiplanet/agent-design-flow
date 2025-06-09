import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { modelsApi, ModelFilters } from '../api/models'
import { buildersApi } from '../api/builders'
import { ModelCreate, ModelUpdate, Model2 } from '../types/model'
import { formatRelativeTime } from '../lib/datetime'

// Transform backend Model to frontend Model2 format
const transformModelToModel2 = (model: any): Model2 => {
  const config = model.component?.config;
  const label = model.component?.label;
  const description = model.component?.description;

  const dateToFormat = model.updated_at || model.created_at;
  const lastModified = formatRelativeTime(dateToFormat);

  return {
    id: model.id,
    name: label || config?.model || 'Unnamed Model',
    description: description || 'No description',
    modelId: config?.model || 'Unknown',
    lastModified,
  }
}

export const useModels = (params?: ModelFilters) => {
  return useQuery({
    queryKey: ['models', params],
    queryFn: () => modelsApi.getAll(params),
    placeholderData: keepPreviousData,
    select: (data) => ({
      ...data,
      items: data.items.map(transformModelToModel2)
    })
  })
}

export const useModel = (id: string) => {
  return useQuery({
    queryKey: ['model', id],
    queryFn: () => modelsApi.getById(id),
    enabled: !!id,
  })
}

export const useModelConfigs = () => {
  return useQuery({
    queryKey: ['builders', 'model-configs'],
    queryFn: () => buildersApi.getModelConfigs(),
    staleTime: 10 * 60 * 1000, // 10 minutes - configs don't change often
  })
}

export const useCreateModel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ModelCreate) => modelsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })
}

export const useUpdateModel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ModelUpdate }) =>
      modelsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
      queryClient.invalidateQueries({ queryKey: ['model', id] })
    },
  })
}

export const useDeleteModel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      modelsApi.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })
}

export const useRestoreModel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => modelsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })
}