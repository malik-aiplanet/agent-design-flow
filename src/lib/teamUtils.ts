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