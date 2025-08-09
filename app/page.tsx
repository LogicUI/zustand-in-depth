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
