export default function SkeletonHiringForm() {
  return (
    <div className="sm:px-4 mt-10 mb-3 sm:mt-10 sm:mb-3 lg:my-8 mx-4 bg-white rounded-xl shadow p-6 animate-pulse">
      <div className="flex gap-2 items-center mb-2 w-full">
        <div className="w-10 h-10 bg-gray-200 rounded" />
      </div>
      <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-5 w-40 bg-gray-200 rounded mt-8 mb-4" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-10 w-10 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-10 w-10 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded" />
      </div>
      <div className="h-5 w-40 bg-gray-200 rounded mt-8 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-24 w-full bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex justify-end gap-2 w-full mt-6">
        <div className="h-10 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
