import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { outputsApi } from '@/api/outputs';
import { OutputCreate, OutputUpdate, OutputFilters } from '@/types/output';

export const useOutputs = (params?: OutputFilters) => {
  return useQuery({
    queryKey: ['outputs', params],
    queryFn: () => outputsApi.getAll(params),
  });
};

export const useOutput = (id: string) => {
  return useQuery({
    queryKey: ['output', id],
    queryFn: () => outputsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateOutput = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OutputCreate) => outputsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outputs'] });
    },
  });
};

export const useUpdateOutput = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OutputUpdate }) =>
      outputsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['outputs'] });
      queryClient.invalidateQueries({ queryKey: ['output', id] });
    },
  });
};

export const useDeleteOutput = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permanent = false }: { id: string; permanent?: boolean }) =>
      outputsApi.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outputs'] });
    },
  });
};