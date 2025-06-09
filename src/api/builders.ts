import { ApiService } from '../lib/api'
import { ModelConfig, AgentConfig } from '../types/agent'
import { TerminationConditionComponent } from '../types/termination'

export const buildersApi = {
  getModelConfigs: (): Promise<ModelConfig[]> => {
    return ApiService.get<ModelConfig[]>('/private/builders/model_configs');
  },

  getAgentConfig: (): Promise<AgentConfig> => {
    return ApiService.get<AgentConfig>('/private/builders/agent_config');
  },

  getTerminationConditionConfigs: (): Promise<TerminationConditionComponent[]> => {
    return ApiService.get<TerminationConditionComponent[]>('/private/builders/termination_condition_configs');
  },
}