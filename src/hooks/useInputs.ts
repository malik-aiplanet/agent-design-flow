import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inputsApi } from '@/api/inputs';
import { InputCreate, InputUpdate, InputFilters } from '@/types/input';

export const useInputs = (params?: InputFilters) => {
  return useQuery({
    queryKey: ['inputs', params],
    queryFn: () => inputsApi.getAll(params),
  });
};

export const useInput = (id: string) => {
  return useQuery({
    queryKey: ['input', id],
    queryFn: () => inputsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateInput = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InputCreate) => inputsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inputs'] });
    },
  });
};

export const useUpdateInput = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InputUpdate }) =>
      inputsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inputs'] });
      queryClient.invalidateQueries({ queryKey: ['input', id] });
    },
  });
};

export const useDeleteInput = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permanent = false }: { id: string; permanent?: boolean }) =>
      inputsApi.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inputs'] });
    },
  });
};