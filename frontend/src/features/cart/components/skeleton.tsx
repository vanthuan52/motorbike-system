import React from "react";

export default function Skeleton({ products }: { products: number }) {
  const skeletons = Array.from({ length: products });

  return (
    <div className="bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] p-6">
      <div className="animate-pulse space-y-4">
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border last:border-b-0 py-4"
          >
            <div className="w-10 h-10 bg-secondary-100 rounded-full" />
            <div className="w-16 h-16 bg-secondary-100 rounded" />
            <div className="flex-1">
              <div className="w-32 h-4 bg-secondary-100 rounded mb-2" />
              <div className="w-20 h-4 bg-secondary-100 rounded" />
            </div>
            <div className="w-24 h-8 bg-secondary-100 rounded" />
            <div className="w-16 h-4 bg-secondary-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
