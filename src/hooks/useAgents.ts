import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { agentsApi, AgentFilters } from '../api/agents'
import { buildersApi } from '../api/builders'
import { AgentCreate, AgentUpdate, Agent2 } from '../types/agent'
import { formatRelativeTime } from '../lib/datetime'

// Utility function to transform backend Agent to frontend Agent2 format
const transformAgentToAgent2 = (agent: any): Agent2 => {
  const config = agent.component?.config;

    // Extract agent type from provider string dynamically
  const getAgentTypeFromProvider = (provider: string): string => {
    if (!provider) return 'Unknown Agent';

    // Extract the class name from the provider (e.g., "autogen_agentchat.agents.AssistantAgent" -> "AssistantAgent")
    const className = provider.split('.').pop() || 'Unknown';

    // Convert camelCase to readable format (e.g., "AssistantAgent" -> "Assistant Agent")
    return className.replace(/([A-Z])/g, ' $1').trim();
  };

  const agentType = getAgentTypeFromProvider(agent.component?.provider);
  const isUserProxyAgent = agent.component?.provider === "autogen_agentchat.agents.UserProxyAgent";

  if (isUserProxyAgent) {
    // UserProxyAgent has simpler structure - no model_client or workbench
    const dateToFormat = agent.updated_at || agent.created_at;
    const lastModified = formatRelativeTime(dateToFormat);

    return {
      id: agent.id,
      name: config?.name || 'Unnamed Agent',
      description: config?.description || 'No description',
      modelClient: 'N/A', // UserProxyAgent doesn't use a model
      status: agent.is_active ? "Active" : "Inactive",
      lastModified,
      toolsCount: 0, // UserProxyAgent doesn't use tools
      agentType,
    }
  } else {
    // AssistantAgent has full structure with model_client and tools
    const modelClient = config?.model_client;

    // Select the most recent date (updated_at or created_at as fallback)
    const dateToFormat = agent.updated_at || agent.created_at;
    const lastModified = formatRelativeTime(dateToFormat);

    return {
      id: agent.id,
      name: config?.name || 'Unnamed Agent', // name is in component.config.name
      description: config?.description || 'No description', // description is in component.config.description
      modelClient: modelClient?.config?.model || modelClient?.label || 'Unknown',
      status: agent.is_active ? "Active" : "Inactive",
      lastModified,
      toolsCount: config?.tools?.length || 0,
      agentType,
    }
  }
}

export const useAgents = (params?: AgentFilters) => {
  return useQuery({
    queryKey: ['agents', params],
    queryFn: () => agentsApi.getAll(params),
    placeholderData: keepPreviousData,
    select: (data) => ({
      ...data,
      items: data.items.map(transformAgentToAgent2)
    })
  })
}

export const useAgent = (id: string) => {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => agentsApi.getById(id),
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

export const useAgentConfig = () => {
  return useQuery({
    queryKey: ['builders', 'agent-config'],
    queryFn: () => buildersApi.getAgentConfig(),
    staleTime: 10 * 60 * 1000, // 10 minutes - configs don't change often
  })
}

export const useCreateAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AgentCreate) => agentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}

export const useUpdateAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AgentUpdate }) =>
      agentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agent', id] })
    },
  })
}

export const useDeleteAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      agentsApi.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}

export const useRestoreAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => agentsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}