import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { teamsApi } from '../api/teams'
import { TeamFilters, TeamCreateRequest, TeamUpdate, Team2, TeamResponse } from '../types/team'
import { formatRelativeTime } from '../lib/datetime'

// Utility function to transform backend Team to frontend Team2 format
const transformTeamToTeam2 = (team: TeamResponse): Team2 => {
  const config = team.component?.config;
  const label = team.component?.label || 'Unknown Team';

  // Extract team name from label since team config doesn't have a name property
  const name = label;

  // Extract description from component description
  const description = team.component?.description || 'No description';

  // Select the most recent date (updated_at or created_at as fallback)
  const dateToFormat = team.updated_at || team.created_at;
  const lastModified = formatRelativeTime(dateToFormat);

  // Extract team type from provider
  const teamType = team.component?.provider?.split('.').pop() || 'Unknown';

  return {
    id: team.id,
    name,
    description,
    teamType,
    status: team.is_deleted ? "Inactive" : "Active",
    lastModified,
    participantsCount: config?.participants?.length || 0,
    maxTurns: config?.max_turns || 0,
  }
}

export const useTeams = (params?: TeamFilters) => {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: () => teamsApi.getAll(params),
    placeholderData: keepPreviousData,
    select: (data) => ({
      ...data,
      items: data.items.map(transformTeamToTeam2)
    })
  })
}

export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TeamCreateRequest) => teamsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TeamUpdate }) =>
      teamsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['team', id] })
    },
  })
}

export const useDeleteTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      teamsApi.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export const useRestoreTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => teamsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}