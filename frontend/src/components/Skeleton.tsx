import React from 'react';

interface SkeletonProps {
  count?: number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ count = 3, className = "" }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-white/70 animate-pulse rounded-3xl p-5 mb-4 shadow-sm ${className}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded-xl w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-1/2"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded-xl w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-4/5"></div>
        </div>
      ))}
    </>
  );
};

export default Skeleton;