export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  incrementBy: (amount: number) => void;
  reset: () => void;
}

export interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
  fetchComments: () => Promise<void>;
  setHydrated: () => void;
  clearComments: () => void;
}

export interface AppState extends CounterState, CommentsState {
  resetAll: () => void;
}

export interface PersistedState {
  comments: Comment[];
  count: number;
}