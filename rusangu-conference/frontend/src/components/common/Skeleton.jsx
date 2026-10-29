import React from 'react';

export const SkeletonText = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${width} ${height} bg-gray-300 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
);

export const SkeletonCard = ({ children, className = '' }) => (
  <div className={`glass-card ${className}`}>
    {children || (
      <>
        <div className="flex items-center space-x-4">
          <SkeletonText width="w-12" height="h-12" className="rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-3/4" height="h-4" />
            <SkeletonText width="w-1/2" height="h-3" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <SkeletonText width="w-full" height="h-4" />
          <SkeletonText width="w-5/6" height="h-4" />
        </div>
      </>
    )}
  </div>
);

export const SkeletonGrid = ({ columns = 3, count = 6 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="glass-card overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="px-4 py-3 text-left">
              <SkeletonText width="w-20" height="h-4" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="border-b border-gray-100 dark:border-gray-700/50">
            {Array.from({ length: cols }).map((_, j) => (
              <td key={j} className="px-4 py-3">
                <SkeletonText width="w-full" height="h-4" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonForm = ({ fields = 6 }) => (
  <div className="glass-card space-y-4">
    <SkeletonText width="w-1/3" height="h-6" className="mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonText width="w-1/2" height="h-3" />
          <SkeletonText width="w-full" height="h-10" />
        </div>
      ))}
    </div>
    <SkeletonText width="w-32" height="h-10" className="mt-4" />
  </div>
);

const Skeleton = {
  Text: SkeletonText,
  Card: SkeletonCard,
  Grid: SkeletonGrid,
  Table: SkeletonTable,
  Form: SkeletonForm,
};

export default Skeleton;