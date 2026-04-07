export const SkeletonCard = () => (
  <div className="relative bg-surface rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)] p-2 flex flex-col gap-2 animate-pulse min-h-[260px]">
    <div className="relative rounded-[var(--radius-xl)] overflow-hidden aspect-[5/2.5] bg-secondary-100">
      <div className="absolute top-2 left-2 h-6 w-20 rounded-full bg-surface-alt" />
      <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-surface-alt" />
    </div>
    <div className="h-5 w-3/4 bg-secondary-100 rounded mt-3" />
    <div className="h-6 w-1/3 bg-secondary-200 rounded mt-2" />
    <div className="flex gap-2 mt-3">
      <div className="w-5 h-5 rounded-full bg-secondary-100" />
      <div className="w-5 h-5 rounded-full bg-secondary-200" />
      <div className="w-5 h-5 rounded-full bg-surface-alt" />
    </div>
  </div>
);
