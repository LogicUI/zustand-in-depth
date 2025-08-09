import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { AppState, PersistedState } from '@/types/store';

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Counter state
        count: 0,
        increment: () => set(
          (state) => ({ count: state.count + 1 }),
          false,
          'increment'
        ),
        decrement: () => set(
          (state) => ({ count: state.count - 1 }),
          false,
          'decrement'
        ),
        incrementBy: (amount: number) => set(
          (state) => ({ count: state.count + amount }),
          false,
          'incrementBy'
        ),
        reset: () => set({ count: 0 }, false, 'resetCounter'),

        // Comments state
        comments: [],
        loading: false,
        error: null,
        isHydrated: false,

        fetchComments: async () => {
          set({ loading: true, error: null }, false, 'fetchComments/start');

          try {
            const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=10');
            if (!response.ok) throw new Error('Failed to fetch comments');

            const data = await response.json();
            set({
              comments: data,
              loading: false,
              error: null
            }, false, 'fetchComments/success');
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An error occurred',
              loading: false
            }, false, 'fetchComments/error');
          }
        },

        setHydrated: () => set({ isHydrated: true }, false, 'setHydrated'),

        clearComments: () => set({ comments: [], error: null }, false, 'clearComments'),

        // Global reset
        resetAll: () => set({
          count: 0,
          comments: [],
          loading: false,
          error: null
        }, false, 'resetAll')
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state): PersistedState => ({
          comments: state.comments,
          count: state.count
        }),
        onRehydrateStorage: () => (state) => {
          console.log('🔄 Hydration started');

          return (state: AppState | undefined, error?: unknown) => {
            if (error) {
              console.error('❌ Hydration failed:', error);
            } else {
              console.log('✅ Hydration completed', state);
              state?.setHydrated();
            }
          };
        },
        version: 1,
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // Migration logic for future versions
          }
          return persistedState;
        }
      }
    ),
    {
      name: 'AppStore'
    }
  )
);

export default useAppStore;