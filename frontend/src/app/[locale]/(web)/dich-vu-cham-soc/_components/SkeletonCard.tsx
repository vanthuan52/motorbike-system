export const SkeletonCard = () => (
  <div className="relative bg-white rounded-2xl shadow-md p-2 flex flex-col gap-2 animate-pulse min-h-[260px]">
    <div className="relative rounded-xl overflow-hidden aspect-[5/2.5] bg-gray-200">
      <div className="absolute top-2 left-2 h-6 w-20 rounded-full bg-gray-100" />
      <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-100" />
    </div>
    <div className="h-5 w-3/4 bg-gray-200 rounded mt-3" />
    <div className="h-6 w-1/3 bg-gray-300 rounded mt-2" />
    <div className="flex gap-2 mt-3">
      <div className="w-5 h-5 rounded-full bg-gray-200" />
      <div className="w-5 h-5 rounded-full bg-gray-300" />
      <div className="w-5 h-5 rounded-full bg-gray-100" />
    </div>
  </div>
);
