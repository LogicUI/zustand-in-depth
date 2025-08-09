'use client';

import useAppStore from '@/store/useAppStore';
import { shallow } from 'zustand/shallow';

export default function CounterSection() {
  const { count, increment, decrement, incrementBy, reset } = useAppStore(
    (state) => ({
      count: state.count,
      increment: state.increment,
      decrement: state.decrement,
      incrementBy: state.incrementBy,
      reset: state.reset
    }),
    shallow
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Counter</h2>
      
      <div className="text-center mb-6">
        <span className="text-5xl font-bold text-blue-600">{count}</span>
        <p className="text-sm text-gray-500 mt-2">Value persisted to localStorage</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Decrement
        </button>
        <button
          onClick={() => incrementBy(5)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          +5
        </button>
        <button
          onClick={() => incrementBy(10)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          +10
        </button>
        <button
          onClick={reset}
          className="col-span-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Reset Counter
        </button>
      </div>
    </div>
  );
}