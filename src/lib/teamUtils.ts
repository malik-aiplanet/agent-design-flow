import { RotateCcw, Target, GitBranch, Settings } from "lucide-react";

/**
 * Get the appropriate icon component for a team type label
 */
export const getTeamTypeIcon = (label: string) => {
  switch (label) {
    case "RoundRobinGroupChat":
      return RotateCcw;
    case "SelectorGroupChat":
      return Target;
    case "Swarm":
      return GitBranch;
    default:
      return Settings;
  }
};

/**
 * Get a friendly display name for a team type
 */
export const getTeamTypeName = (label: string): string => {
  switch (label) {
    case "RoundRobinGroupChat":
      return "Round Robin Group Chat";
    case "SelectorGroupChat":
      return "Selector Group Chat";
    case "Swarm":
      return "Swarm";
    default:
      return label;
  }
};

// Transform agent IDs to participant components format
export const transformAgentsToParticipants = async (agentIds: string[]) => {
  if (!agentIds || agentIds.length === 0) {
    return [];
  }

  try {
    // Import agentsApi dynamically to avoid circular dependencies
    const { agentsApi } = await import('../api/agents');

    // Fetch all agents by their IDs
    const agentPromises = agentIds.map(id => agentsApi.getById(id));
    const agents = await Promise.all(agentPromises);

    // Transform agents to participant format
    const participants = agents.map(agent => ({
      provider: agent.component.provider,
      component_type: agent.component.component_type as "agent",
      version: agent.component.version,
      component_version: agent.component.component_version,
      description: agent.component.description,
      label: agent.component.label,
      config: agent.component.config as any // Type cast to avoid strict typing issues with model_client config
    }));

    return participants;
  } catch (error) {
    console.error('Failed to fetch agent data for participants:', error);
    return [];
  }
};