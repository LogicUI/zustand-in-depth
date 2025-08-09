import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Define the store interface
interface AppState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: (value: number) => void
}

// Create the store with persist middleware for hydration
// This will automatically save to localStorage and hydrate on client-side
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      count: 0,

      // Actions to modify state
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
      setCount: (value: number) => set({ count: value }),
    }),
    {
      name: 'app-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
      // This handles hydration automatically when the component mounts
    }
  )
)
