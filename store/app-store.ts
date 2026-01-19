
import { create } from 'zustand';

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  primaryColor: localStorage.getItem('primary-color') || '#0F172A',
  setPrimaryColor: (color) => {
    localStorage.setItem('primary-color', color);
    set({ primaryColor: color });
  },
}));
