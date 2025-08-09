<<<<<<< HEAD
'use client';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

export default function Home() {
  const count = useStore(s => s.count);
  const increment = useStore(s => s.increment);
  const decrement = useStore(s => s.decrement);
  const incrementBy = useStore(s => s.incrementBy);
  const reset = useStore(s => s.reset);
  const extractValues = useStore(s => s.extractValues);

  const comments = useStore(s => s.comments);
  const loading = useStore(s => s.loading);
  const error = useStore(s => s.error);
  const fetchComments = useStore(s => s.fetchComments);

  const handleIncrementBy = () => {
    incrementBy(10);
  }

  useEffect(() => {
    fetchComments();        // auto-load on mount
  }, [fetchComments]);



  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          This is a test
        </h1>
        <p className="text-2xl font-bold text-gray-900 mb-4">{count}</p>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2" onClick={reset}>Reset</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={increment}>Increment</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={decrement}>Decrement</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleIncrementBy}>Increment by 10</button>
        <div className="text-2xl font-bold text-gray-900 mb-4">{extractValues()}</div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Comments
        </h1>
        {loading && <div className="text-lg text-blue-500 mb-2">Loading comments...</div>}
        {error && <div className="text-lg text-red-500 mb-2">Error: {error}</div>}
        <ul className="space-y-2">
          {comments.map(comment => (
            <li key={comment.id} className="bg-white p-4 rounded shadow">
              <div className="font-semibold">{comment.name} <span className="text-gray-500 text-sm">({comment.email})</span></div>
              <div className="text-gray-700">{comment.body}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
=======
import Counter from '@/components/Counter';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            This is a test
          </h1>
          <p className="text-xl text-gray-600">
            Next.js + Zustand + Tailwind CSS Experimental Project
          </p>
          <p className="text-md text-gray-500 mt-2">
            Demonstrating client-side hydration with persistent state
          </p>
        </div>

        {/* Counter Component with Hydration */}
        <div className="flex justify-center mb-12">
          <Counter />
        </div>

        {/* Additional Information */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Understanding SSR Hydration in Next.js
            </h2>
            
            {/* Comments explaining the process */}
            <div className="space-y-4 text-gray-700">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-2">What is Hydration?</h3>
                <p className="text-sm">
                  Hydration is the process where React takes over the server-rendered HTML and makes it interactive 
                  by attaching event handlers and restoring client-side state.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold mb-2">How Our Counter Works:</h3>
                <ul className="text-sm space-y-1">
                  <li>• The counter component is marked with 'use client' directive</li>
                  <li>• On server-side, it renders a loading placeholder</li>
                  <li>• On client-side mount, it checks localStorage for saved state</li>
                  <li>• Zustand's persist middleware automatically syncs the state</li>
                  <li>• The component re-renders with the hydrated values</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold mb-2">Try This:</h3>
                <ol className="text-sm space-y-1">
                  <li>1. Click the buttons to change the counter value</li>
                  <li>2. Refresh the page (Cmd/Ctrl + R)</li>
                  <li>3. Notice the counter value persists!</li>
                  <li>4. Open DevTools → Application → Local Storage to see the stored data</li>
                </ol>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">Technical Details:</h3>
                <p className="text-sm">
                  The <code className="bg-gray-100 px-1 rounded">useEffect</code> hook with the 
                  <code className="bg-gray-100 px-1 rounded ml-1">isHydrated</code> state prevents 
                  hydration mismatches by ensuring the server and client render the same initial content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
>>>>>>> 9cc52abc (add rehydration section)
