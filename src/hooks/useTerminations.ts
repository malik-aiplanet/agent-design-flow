import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { terminationsApi } from '../api/terminations'
import { buildersApi } from '../api/builders'
import { TerminationConditionCreate, TerminationConditionUpdate, Termination2, TerminationConditionFilters } from '../types/termination'
import { formatRelativeTime } from '../lib/datetime'

// Transform backend response to frontend display format (without status)
const transformTerminationToTermination2 = (termination: any): Termination2 => {
  const config = termination.component?.config;
  const label = termination.component?.label;
  const description = termination.component?.description;

  const dateToFormat = termination.updated_at || termination.created_at;
  const lastModified = formatRelativeTime(dateToFormat);

  return {
    id: termination.id,
    name: config?.name || label || 'Unnamed Termination',
    description: description || 'No description',
    terminationType: label || 'Unknown',
    lastModified,
    config: config || {},
    component: termination.component,
  }
}

export const useTerminations = (params?: TerminationConditionFilters) => {
  return useQuery({
    queryKey: ['terminations', params],
    queryFn: () => terminationsApi.getAll(params),
    placeholderData: keepPreviousData,
    select: (data) => ({
      ...data,
      items: data.items.map(transformTerminationToTermination2)
    })
  })
}

export const useTermination = (id: string) => {
  return useQuery({
    queryKey: ['termination', id],
    queryFn: () => terminationsApi.getById(id),
    enabled: !!id,
  })
}

export const useTerminationConditionConfigs = () => {
  return useQuery({
    queryKey: ['builders', 'termination-condition-configs'],
    queryFn: () => buildersApi.getTerminationConditionConfigs(),
    staleTime: 10 * 60 * 1000, // 10 minutes - configs don't change often
  })
}

export const useCreateTermination = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TerminationConditionCreate) => terminationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminations'] })
    },
  })
}

export const useUpdateTermination = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TerminationConditionUpdate }) =>
      terminationsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['terminations'] })
      queryClient.invalidateQueries({ queryKey: ['termination', id] })
    },
  })
}

export const useDeleteTermination = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      terminationsApi.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminations'] })
    },
  })
}

export const useRestoreTermination = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => terminationsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminations'] })
    },
  })
}