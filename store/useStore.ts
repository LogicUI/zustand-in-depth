// store.ts
import { create, type StoreApi } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// --- Domain types ---
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// --- Slices ---
interface CounterSlice {
  count: number;
  example: string;
  increment: () => void;
  decrement: () => void;
  incrementBy: (value: number) => void;
  extractValues: () => string;
  reset: () => void;
}

interface CommentsSlice {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchComments: () => Promise<void>;
}

// Combined store
type AppState = CounterSlice & CommentsSlice;

// Helpers for slice creators
type Set = StoreApi<AppState>['setState'];
type Get = StoreApi<AppState>['getState'];

// ----- counter slice -----
const createCounterSlice = (set: Set, get: Get): CounterSlice => ({
  count: 0,
  example: 'example',
  increment: () => set(s => ({ count: s.count + 1 })),
  decrement: () => set(s => ({ count: s.count - 1 })),
  incrementBy: (value: number) => set(s => ({ count: s.count + value })),
  extractValues: () => {
    const { count, example } = get();
    return `count: ${count}, example: ${example}`;
  },
  reset: () => set({ count: 0 }),
});

// ----- comments slice (NOTE: function, not create()) -----
const createCommentsSlice = (set: Set, get: Get): CommentsSlice => ({
  comments: [],
  loading: false,
  error: null,

  fetchComments: async () => {
    // simple guard: if we already have comments (possibly from persist), skip
    if (get().comments.length > 0) return;

    set({ loading: true, error: null });
    try {
      const r = await fetch('https://jsonplaceholder.typicode.com/posts/1/comments');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: Comment[] = await r.json();
      set({ comments: data, loading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to load', loading: false });
    }
  },
});

// ----- root store: devtools + persist (persist only comments) -----
export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createCounterSlice(set, get),
        ...createCommentsSlice(set, get),
      }),
      {
        name: 'app-v1',
        // keep only comments across reloads (not loading/error/etc.)
        partialize: (s) => ({ comments: s.comments }),
      }
    ),
    { name: 'AppStore' }
  )
);
