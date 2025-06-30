import React from "react";

export default function Skeleton({ products }: { products: number }) {
  const skeletons = Array.from({ length: products });

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="animate-pulse space-y-4">
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b last:border-b-0 py-4"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-16 h-16 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded" />
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
