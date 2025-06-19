import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className = '', lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 dark:bg-gray-700 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          } ${lines > 1 ? 'mb-2' : ''}`}
          style={{ height: '1rem' }}
        />
      ))}
    </div>
  );
}