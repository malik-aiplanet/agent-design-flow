import { ApiService } from '../lib/api'
import { ModelConfig, AgentConfig } from '../types/agent'

export const buildersApi = {
  getModelConfigs: (): Promise<ModelConfig[]> => {
    return ApiService.get<ModelConfig[]>('/private/builders/model_configs');
  },

  getAgentConfig: (): Promise<AgentConfig> => {
    return ApiService.get<AgentConfig>('/private/builders/agent_config');
  },
}