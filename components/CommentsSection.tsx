'use client';

import { useEffect } from 'react';
import useAppStore from '@/store/useAppStore';
import { shallow } from 'zustand/shallow';

export default function CommentsSection() {
  const { 
    comments, 
    loading, 
    error, 
    fetchComments, 
    clearComments 
  } = useAppStore(
    (state) => ({
      comments: state.comments,
      loading: state.loading,
      error: state.error,
      fetchComments: state.fetchComments,
      clearComments: state.clearComments
    }),
    shallow
  );

  useEffect(() => {
    // Only fetch if we don't have comments (not persisted from storage)
    if (comments.length === 0 && !loading) {
      fetchComments();
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Comments</h2>
        <div className="space-x-2">
          <button
            onClick={fetchComments}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={clearComments}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">{comment.name}</h3>
              <p className="text-sm text-gray-600">{comment.email}</p>
              <p className="text-gray-700 mt-1">{comment.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No comments loaded. Click "Refresh" to fetch comments.
        </p>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Total: {comments.length} comments {comments.length > 0 && '(Persisted to localStorage)'}
      </div>
    </div>
  );
}