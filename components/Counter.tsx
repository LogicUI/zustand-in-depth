'use client'

import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'

export default function Counter() {
  // Get state and actions from Zustand store
  const { count, increment, decrement, reset, setCount } = useStore()
  
  // Track hydration status to prevent hydration mismatch
  const [isHydrated, setIsHydrated] = useState(false)

  // Effect runs only on client-side after component mounts
  // This ensures proper hydration with persisted state from localStorage
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Show loading state during SSR and initial hydration
  // This prevents hydration mismatch between server and client
  if (!isHydrated) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Counter with Hydration
        </h2>
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 animate-pulse">
            ...
          </div>
          <p className="text-sm text-gray-500 mt-2">Loading persisted state...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Counter with Hydration
      </h2>
      
      {/* Display current count */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-blue-600 transition-all duration-300 transform hover:scale-110">
          {count}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This value persists in localStorage
        </p>
      </div>

      {/* Interactive buttons */}
      <div className="space-y-4">
        {/* Primary action buttons */}
        <div className="flex gap-3">
          <button
            onClick={decrement}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform active:scale-95"
          >
            - Decrement
          </button>
          <button
            onClick={increment}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform active:scale-95"
          >
            + Increment
          </button>
        </div>

        {/* Secondary action buttons */}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform active:scale-95"
          >
            Reset to 0
          </button>
          <button
            onClick={() => setCount(100)}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform active:scale-95"
          >
            Set to 100
          </button>
        </div>

        {/* Custom value input */}
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Enter custom value"
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = parseInt((e.target as HTMLInputElement).value)
                if (!isNaN(value)) {
                  setCount(value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }
            }}
          />
          <button
            onClick={() => setCount(Math.floor(Math.random() * 1000))}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform active:scale-95"
          >
            Random
          </button>
        </div>
      </div>

      {/* Hydration explanation */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">How Hydration Works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Server renders initial HTML without localStorage data</li>
          <li>• Client loads and checks localStorage for persisted state</li>
          <li>• Zustand hydrates the store with saved values</li>
          <li>• Component re-renders with hydrated state</li>
          <li>• Try refreshing the page - count persists!</li>
        </ul>
      </div>
    </div>
  )
}