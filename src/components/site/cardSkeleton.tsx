import React from 'react';

export const ImovelCardSkeleton = () => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
};