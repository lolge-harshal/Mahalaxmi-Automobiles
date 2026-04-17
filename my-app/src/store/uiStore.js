import { create } from 'zustand'

export const useUIStore = create((set) => ({
    sidebarOpen: false,
    theme: 'light',

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setTheme: (theme) => set({ theme }),
}))
