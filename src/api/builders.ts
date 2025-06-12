import { ApiService } from '../lib/api'
import { ToolComponent } from '../types/tool'
import { TeamComponent } from '../types/team'

// Legacy imports for backward compatibility
import { ModelConfig, AgentConfig } from '../types/agent'
import { TerminationConditionComponent } from '../types/termination'

export const buildersApi = {

  // Model configurations
  getModelConfigs: (): Promise<ModelConfig[]> => {
    return ApiService.get<ModelConfig[]>('/private/builders/model_configs')
  },

  // Agent configurations - returns an array from backend
  getAgentConfig: (): Promise<AgentConfig[]> => {
    return ApiService.get<AgentConfig[]>('/private/builders/agent_config')
  },

  // Termination condition configurations
  getTerminationConditionConfigs: (): Promise<TerminationConditionComponent[]> => {
    return ApiService.get<TerminationConditionComponent[]>('/private/builders/termination_condition_configs')
  },

  // Tool configurations (new)
  getToolConfigs: (): Promise<ToolComponent[]> => {
    return ApiService.get<ToolComponent[]>('/private/builders/tool_configs')
  },

  // Input configurations (new)
  getInputConfigs: (): Promise<any[]> => {
    return ApiService.get<any[]>('/private/builders/input_configs')
  },

  // Output configurations (new)
  getOutputConfigs: (): Promise<any[]> => {
    return ApiService.get<any[]>('/private/builders/output_configs')
  },

  // Team configurations (new)
  getTeamConfigs: (): Promise<TeamComponent[]> => {
    return ApiService.get<TeamComponent[]>('/private/builders/team_configs')
  }
}