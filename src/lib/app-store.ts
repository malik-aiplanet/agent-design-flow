import { create } from 'zustand'


interface AppState {
  task: string;
  runId: string | null,
  selectedApp: AppData | null
  apps: AppData[]
  team: TeamData
  messages: Message[]

  setTask: (task: string) => void
  setRunId: (runId: string | null) => void
  setSelectedApp: (app: AppData | null) => void
  setApps: (apps: AppData[]) => void
  setTeam: (team: TeamData) => void
  addMessage: (msg: Message) => void

  get: (id: string) => void
}

export const useAppStore = create<AppState>()((set, get) => ({
  task: "",
  runId: null,
  selectedApp: null,
  apps: [],
  team: null,
  messages: [],
  
  setTask: (task) => set({ task }),
  setRunId: (runId) => set({ runId }),
  setSelectedApp: (app) => set({ selectedApp: app }),
  setApps: (apps) => set({ apps }),  
  setTeam: (team) => set({ team }),
  addMessage: (msg) => set({ messages: [...get().messages, msg] }),

  get: (id) => {
    const { apps } = get()
    const app = apps.find(app => app.id === id)
    if (app) {
      set({ selectedApp: app })
    }
  }
}))