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

## Key Learnings

1. **Selective Subscriptions** are crucial for performance optimization
2. **Shallow comparisons** prevent unnecessary re-renders when selecting multiple values
3. **Async operations** are straightforward without additional complexity
4. **Slices** provide excellent code organization and maintainability
5. **DevTools integration** is essential for debugging complex state flows
6. **Persistence** improves user experience with minimal configuration

## Conclusion

Zustand proves to be an elegant and powerful state management solution that strikes the perfect balance between simplicity and functionality. Its minimal API surface, combined with powerful middleware options, makes it an excellent choice for React applications of any size.

The key to mastering Zustand lies in understanding its subscription model and leveraging its middleware ecosystem effectively. By following the patterns and best practices documented here, you can build performant, maintainable, and user-friendly applications.

---

*This playground serves as both a learning resource and a reference implementation for common Zustand patterns.*