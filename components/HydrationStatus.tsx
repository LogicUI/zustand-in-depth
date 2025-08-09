'use client';

import { useEffect, useState } from 'react';
import useAppStore from '@/store/useAppStore';

export default function HydrationStatus() {
  const [mounted, setMounted] = useState(false);
  const isHydrated = useAppStore((state) => state.isHydrated);
  const comments = useAppStore((state) => state.comments);
  const count = useAppStore((state) => state.count);
  const resetAll = useAppStore((state) => state.resetAll);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-yellow-100 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800">Hydration Status</h3>
        <p className="text-yellow-700">Mounting...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 ${isHydrated ? 'bg-green-100' : 'bg-yellow-100'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Hydration Status</h3>
          <div className="space-y-1 text-sm">
            <p className={isHydrated ? 'text-green-700' : 'text-yellow-700'}>
              Store: {isHydrated ? '✅ Hydrated' : '⏳ Hydrating...'}
            </p>
            <p className="text-gray-600">
              Persisted Count: {count}
            </p>
            <p className="text-gray-600">
              Persisted Comments: {comments.length}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Data is saved to localStorage and restored on page refresh
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            resetAll();
            window.localStorage.removeItem('app-storage');
            window.location.reload();
          }}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
}