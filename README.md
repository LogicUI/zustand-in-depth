# Zustand State Management Playground

**Date:** August 9, 2025  
**Author:** John Wee

## Overview

This playground documents my learning journey with Zustand, a lightweight state management solution for React applications. Through hands-on examples and experimentation, I've explored Zustand's core features, best practices, and advanced patterns.

## Table of Contents

1. [Counter Example - State Subscriptions & Performance](#1-counter-example---state-subscriptions--performance)
2. [Async API Fetch Example](#2-async-api-fetch-example)
3. [Creating Slices - Modular State Management](#3-creating-slices---modular-state-management)
4. [Redux DevTools Integration](#4-redux-devtools-integration)
5. [Persist Middleware - Local Storage](#5-persist-middleware---local-storage)

---

## 1. Counter Example - State Subscriptions & Performance

The counter example demonstrates fundamental Zustand concepts and performance optimization techniques.

### Basic Store Definition

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  incrementBy: (amount) => set((state) => ({ count: state.count + amount })),
  reset: () => set({ count: 0 })
}));
```

### Subscription Patterns

#### ✅ **Best Practice: Selective Subscriptions**

Creating selective subscriptions ensures components only re-render when their specific data changes:

```javascript
// Component only re-renders when count changes
const count = useStore(state => state.count);
```

#### ⚠️ **Avoid: Full Store Destructuring**

```javascript
// ❌ BAD: Component re-renders on ANY store change
const { count, increment, decrement } = useStore();
```

This pattern causes unnecessary re-renders because the component subscribes to the entire store. Even unrelated state changes trigger re-renders.

### Performance Optimization Techniques

#### Using Shallow Comparison

When you need multiple values from the store, use `shallow` comparison to prevent unnecessary re-renders:

```javascript
import { shallow } from 'zustand/shallow';

const { count, increment, decrement, incrementBy, reset } = useStore(
  state => ({
    count: state.count,
    increment: state.increment,
    decrement: state.decrement,
    incrementBy: state.incrementBy,
    reset: state.reset
  }),
  shallow
);
```

The `shallow` equality function compares object properties at the first level, preventing re-renders when the selected values haven't changed.

#### Custom Comparison Functions

For more complex scenarios, you can provide custom comparison logic:

```javascript
const items = useStore(
  state => state.items,
  (oldItems, newItems) => {
    // Custom comparison logic
    return oldItems.length === newItems.length &&
           oldItems.every((item, i) => item.id === newItems[i].id);
  }
);
```

### Key Takeaway

> **Creating separate slices ensures that components only re-render when their specific slice values change, preventing unnecessary re-renders and providing a smooth user experience.**

---

## 2. Async API Fetch Example

Zustand seamlessly handles asynchronous operations without additional middleware or complex patterns.

### Implementation

```javascript
const useCommentsStore = create((set) => ({
  comments: [],
  loading: false,
  error: null,
  
  fetchComments: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      const data = await response.json();
      
      set({ 
        comments: data,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  }
}));
```

### Usage in Components

```javascript
function Comments() {
  const { comments, loading, error, fetchComments } = useCommentsStore();
  
  useEffect(() => {
    fetchComments();
  }, []);
  
  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.name}</li>
      ))}
    </ul>
  );
}
```

### Key Features

- **Simple async/await syntax** - Write async functions naturally
- **Built-in error handling** - Use standard try/catch blocks
- **Loading states** - Easily manage loading indicators
- **No additional setup** - Works out of the box

---

## 3. Creating Slices - Modular State Management

Slices allow you to separate state into different responsibilities, making your store more maintainable and scalable.

### Slice Pattern Implementation

```javascript
// counterSlice.js
export const createCounterSlice = (set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
});

// commentsSlice.js
export const createCommentsSlice = (set) => ({
  comments: [],
  loading: false,
  fetchComments: async () => {
    set({ loading: true });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      const data = await response.json();
      set({ comments: data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  }
});

// Combine slices in main store
import { create } from 'zustand';

const useStore = create((...args) => ({
  ...createCounterSlice(...args),
  ...createCommentsSlice(...args)
}));
```

### Benefits of Slices

- **Separation of Concerns** - Each slice handles its own domain
- **Better Organization** - Easier to locate and modify specific functionality
- **Reusability** - Slices can be shared across different stores
- **Team Collaboration** - Different team members can work on different slices

---

## 4. Redux DevTools Integration

Zustand's DevTools middleware provides powerful debugging capabilities through the Redux DevTools extension.

### Setup

```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set(
        (state) => ({ count: state.count + 1 }),
        false,
        'increment' // Action name in DevTools
      ),
      decrement: () => set(
        (state) => ({ count: state.count - 1 }),
        false,
        'decrement'
      )
    }),
    {
      name: 'MyZustandStore' // Store name in DevTools
    }
  )
);
```

### DevTools Features

- **State Inspection** - View current state in real-time
- **Action History** - Track all state changes throughout the lifecycle
- **Time Travel Debugging** - Jump to any previous state
- **Action Replay** - Replay a sequence of actions
- **State Diff** - Compare state changes between actions
- **Export/Import** - Save and load state snapshots

### Why It's Powerful

> **The ability to track how each state changes and use the replay tool makes debugging complex state interactions significantly easier. You can identify exactly when and why state mutations occur.**

---

## 5. Persist Middleware - Local Storage

The persist middleware automatically saves your store to local storage, maintaining state between page refreshes and sessions.

### Basic Implementation

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      user: null,
      increment: () => set((state) => ({ count: state.count + 1 })),
      setUser: (user) => set({ user })
    }),
    {
      name: 'app-storage' // Unique name for localStorage key
    }
  )
);
```

### Partial Persistence

Sometimes you only want to persist specific parts of your state:

```javascript
const useStore = create(
  persist(
    (set) => ({
      count: 0,
      tempData: [],
      user: null,
      increment: () => set((state) => ({ count: state.count + 1 })),
      setTempData: (data) => set({ tempData: data }),
      setUser: (user) => set({ user })
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        // Only persist count and user, not tempData
        count: state.count,
        user: state.user 
      })
    }
  )
);
```

### Advanced Configuration

```javascript
const useStore = create(
  persist(
    (set) => ({
      // ... your state
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead
      partialize: (state) => ({ /* ... */ }),
      onRehydrateStorage: () => (state) => {
        console.log('State has been rehydrated:', state);
      },
      version: 1, // State versioning for migrations
      migrate: (persistedState, version) => {
        // Handle state migrations between versions
        return persistedState;
      }
    }
  )
);
```

### Benefits

- **Automatic Caching** - State persists between page refreshes
- **Improved UX** - Users don't lose their work on accidental refreshes
- **Offline Support** - Maintain state even when offline
- **Flexible Storage** - Support for localStorage, sessionStorage, or custom storage

---

## 6. Hydration - SSR & Client State Synchronization

Hydration is crucial for preventing mismatches between server-rendered and client-rendered content, especially when using persisted state. This example demonstrates how to properly handle hydration with Zustand.

### The Hydration Problem

In Next.js and other SSR frameworks, the server renders HTML with initial state values. When the client loads, Zustand may restore different values from localStorage, causing a hydration mismatch error:

```
Warning: Text content did not match. Server: "0" Client: "42"
```

### Solution: Hydration Boundary

#### 1. TypeScript Types Definition

```typescript
// types/store.ts
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface AppState extends CounterState, CommentsState {
  resetAll: () => void;
}

export interface PersistedState {
  comments: Comment[];
  count: number;
}
```

#### 2. Store with Hydration Tracking

```typescript
// store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { AppState, PersistedState } from '@/types/store';

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        comments: [],
        loading: false,
        error: null,
        isHydrated: false, // Track hydration status
        
        // Actions
        fetchComments: async () => {
          // ... async fetch logic
        },
        
        setHydrated: () => set({ isHydrated: true }, false, 'setHydrated'),
        
        // ... other actions
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
          
          return (state, error) => {
            if (error) {
              console.error('❌ Hydration failed:', error);
            } else {
              console.log('✅ Hydration completed', state);
              state?.setHydrated(); // Mark as hydrated
            }
          };
        }
      }
    )
  )
);
```

#### 3. Hydration Boundary Component

```typescript
// components/HydrationBoundary.tsx
'use client';

import { useEffect, useState } from 'react';
import useAppStore from '@/store/useAppStore';

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function HydrationBoundary({ 
  children, 
  fallback = <HydrationLoader />
}: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const storeHydrated = useAppStore((state) => state.isHydrated);

  useEffect(() => {
    // Check if we're on the client and store is hydrated
    const checkHydration = async () => {
      // Small delay to ensure store has time to hydrate
      await new Promise(resolve => setTimeout(resolve, 50));
      setIsHydrated(true);
    };
    
    checkHydration();
  }, []);

  if (!isHydrated || !storeHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

#### 4. Usage in Page Component

```typescript
// app/page.tsx
'use client';

import HydrationBoundary from '@/components/HydrationBoundary';
import HydrationStatus from '@/components/HydrationStatus';
import CounterSection from '@/components/CounterSection';
import CommentsSection from '@/components/CommentsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <HydrationStatus />
      
      <HydrationBoundary
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p className="mt-4">Hydrating persisted state...</p>
          </div>
        }
      >
        {/* Components that use persisted state */}
        <CounterSection />
        <CommentsSection />
      </HydrationBoundary>
    </main>
  );
}
```

### How Hydration Works

1. **Initial Server Render** - Server renders with default store values
2. **Client Mount** - React hydrates the DOM on the client
3. **Store Rehydration** - Zustand checks localStorage for persisted state
4. **Hydration Boundary** - Prevents rendering until store is fully hydrated
5. **Synchronized Render** - Components render with correct persisted values

### Key Implementation Details

#### Hydration Status Component

Shows real-time hydration status and persisted data:

```typescript
// components/HydrationStatus.tsx
export default function HydrationStatus() {
  const [mounted, setMounted] = useState(false);
  const isHydrated = useAppStore((state) => state.isHydrated);
  const comments = useAppStore((state) => state.comments);
  const count = useAppStore((state) => state.count);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Mounting...</div>;
  }

  return (
    <div className={isHydrated ? 'bg-green-100' : 'bg-yellow-100'}>
      <p>Store: {isHydrated ? '✅ Hydrated' : '⏳ Hydrating...'}</p>
      <p>Persisted Count: {count}</p>
      <p>Persisted Comments: {comments.length}</p>
    </div>
  );
}
```

### Benefits of Proper Hydration

- **No Hydration Errors** - Prevents mismatches between server and client
- **Smooth UX** - Shows loading state while hydrating
- **Type Safety** - Full TypeScript support for state and actions
- **Debug Visibility** - Clear indication of hydration status
- **Persisted State** - Maintains user data across sessions

### Common Pitfalls to Avoid

1. **Don't access localStorage directly in components** - Let Zustand handle it
2. **Don't render persisted values before hydration** - Use HydrationBoundary
3. **Don't forget the fallback UI** - Users should see something while hydrating
4. **Don't mix server and client state** - Keep them clearly separated

### Testing Hydration

To test the hydration behavior:

1. Interact with the counter or fetch comments
2. Refresh the page
3. Observe the hydration loader briefly appear
4. See your persisted state restored
5. Check DevTools console for hydration logs

---

## 7. Shallow Merge in Zustand

Understanding how Zustand's `set` function works with the shallow merge parameter is crucial for proper state management.

### The set Function Signature

```javascript
set(partialOrUpdater, replace?, actionName?)
```

- **partialOrUpdater**: The state update (object or function)
- **replace**: Boolean flag (default: `false`)
  - `false` → Shallow merge with existing state
  - `true` → Replace entire state
- **actionName**: Optional label for Redux DevTools

### What is Shallow Merge?

Shallow merge means "merge only the top level" of the state object. When you use `set(partial, false)` (the default), Zustand performs:

```javascript
state = { ...state, ...partial }
```

This means:
- Only top-level keys in `partial` overwrite the same keys in `state`
- Nested objects/arrays are **replaced entirely**, not merged recursively

### Examples with Shallow Merge (false)

Consider a store with this initial state:
```javascript
{
  count: 1,
  user: {
    name: 'Ann',
    prefs: {
      theme: 'dark'
    }
  },
  tags: ['a', 'b']
}
```

#### Example 1: Updating a top-level primitive
```javascript
set({ count: 2 }, false)
// Result:
{
  count: 2,  // ✅ Updated
  user: { name: 'Ann', prefs: { theme: 'dark' } },  // ✅ Preserved
  tags: ['a', 'b']  // ✅ Preserved
}
```

#### Example 2: Updating a nested object (shallow merge pitfall)
```javascript
set({ user: { name: 'Bob' } }, false)
// Result:
{
  count: 1,
  user: { name: 'Bob' },  // ⚠️ Entire user object replaced
  tags: ['a', 'b']
}
// Notice: prefs is GONE because user was replaced as a whole
```

#### Example 3: Properly updating nested objects
To preserve nested properties, manually spread them:
```javascript
set((state) => ({
  user: {
    ...state.user,
    name: 'Bob'  // Only update name, preserve prefs
  }
}), false)
// Result:
{
  count: 1,
  user: { name: 'Bob', prefs: { theme: 'dark' } },  // ✅ prefs preserved
  tags: ['a', 'b']
}
```

### What Happens with Replace (true)?

When you use `set(partialOrUpdater, true)`, the **entire store** is replaced with what you return. Anything not included is lost.

#### Example 1: Dangerous replacement
```javascript
// ❌ BAD: Loses all other state
set((state) => ({ count: state.count - 1 }), true)
// Result:
{ count: 0 }  // user, tags, everything else GONE!
```

#### Example 2: Safe replacement (if needed)
```javascript
// If you really need replace, carry over the rest:
set((state) => ({ ...state, count: state.count - 1 }), true)
// Result: All state preserved with count updated
```

### Practical Usage in Counter Example

In our counter store:
```javascript
decrement: () => set(
  (state) => ({ count: state.count - 1 }),
  false,        // Shallow merge (default)
  'decrement'   // Action name for DevTools
)
```

This:
1. Returns `{ count: newValue }`
2. Shallow merges with existing state (preserves other properties)
3. Labels the action as 'decrement' in Redux DevTools

### Rules of Thumb

1. **Use `false` (default) for normal updates** - This is what you want 99% of the time
2. **Use `true` only for complete state resets** - When you intentionally want to replace everything
3. **Be careful with nested objects** - They're replaced, not merged
4. **For deep updates, do it manually** - Use spread operators to preserve nested data

### Common Patterns

#### Pattern 1: Update multiple top-level fields
```javascript
// ✅ Good - shallow merge works perfectly here
set({ count: 5, loading: false, error: null })
```

#### Pattern 2: Update nested object field
```javascript
// ✅ Good - manually preserve nested structure
set((state) => ({
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      avatar: 'new-url.jpg'
    }
  }
}))
```

#### Pattern 3: Reset entire store
```javascript
// ✅ Good use of replace=true
const initialState = { count: 0, user: null, tags: [] };
reset: () => set(initialState, true)
```

### Key Takeaway

> **Zustand's shallow merge is efficient but requires careful handling of nested objects. Always remember that nested objects are replaced, not merged, so spread them manually when you need to preserve their properties.**

---

## Key Learnings

1. **Selective Subscriptions** are crucial for performance optimization
2. **Shallow comparisons** prevent unnecessary re-renders when selecting multiple values
3. **Async operations** are straightforward without additional complexity
4. **Slices** provide excellent code organization and maintainability
5. **DevTools integration** is essential for debugging complex state flows
6. **Persistence** improves user experience with minimal configuration
7. **Proper Hydration** prevents SSR mismatches and ensures smooth state restoration

## Conclusion

Zustand proves to be an elegant and powerful state management solution that strikes the perfect balance between simplicity and functionality. Its minimal API surface, combined with powerful middleware options, makes it an excellent choice for React applications of any size.

The key to mastering Zustand lies in understanding its subscription model, leveraging its middleware ecosystem effectively, and properly handling hydration in SSR environments. By following the patterns and best practices documented here, you can build performant, maintainable, and user-friendly applications.

---

*This playground serves as both a learning resource and a reference implementation for common Zustand patterns.*