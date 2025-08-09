'use client';

import { useEffect, useState } from 'react';
import useAppStore from '@/store/useAppStore';
import * as React from 'react';


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

function HydrationLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your saved data...</p>
      </div>
    </div>
  );
}