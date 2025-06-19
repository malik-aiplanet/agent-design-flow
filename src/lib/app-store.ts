import { create } from 'zustand'


interface AppState {
  task: string;
  runId: string | null,
  selectedApp: AppData | null
  apps: AppData[]
  team: TeamData

  setTask: (task: string) => void
  setRunId: (runId: string | null) => void
  setSelectedApp: (app: AppData | null) => void
  setApps: (apps: AppData[]) => void
  setTeam: (team: TeamData) => void

  get: (id: string) => void
}

export const useAppStore = create<AppState>()((set, get) => ({
  task: "",
  runId: null,
  selectedApp: null,
  apps: [],
  team: null,
  
  setTask: (task) => set({ task }),
  setRunId: (runId) => set({ runId }),
  setSelectedApp: (app) => set({ selectedApp: app }),
  setApps: (apps) => set({ apps }),  
  setTeam: (team) => set({ team }),

  get: (id) => {
    const { apps } = get()
    const app = apps.find(app => app.id === id)
    if (app) {
      set({ selectedApp: app })
    }
  }
}))