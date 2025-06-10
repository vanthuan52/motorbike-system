export default function SkeletonProductForm() {
  return (
    <div className="sm:px-4 mt-10 mb-3 sm:mt-10 sm:mb-3 lg:my-8 mx-4 bg-white rounded-xl shadow p-6 animate-pulse">
      {/* Header */}
      <div className="flex gap-2 items-center mb-2 w-full">
        <div className="h-8 w-24 bg-gray-200 rounded" />
      </div>

      <div className="h-5 w-40 bg-gray-100 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-6">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="mb-4">
            <div className="h-4 w-28 bg-gray-100 rounded mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="h-5 w-32 bg-gray-100 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-6">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="mb-4">
            <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="h-5 w-24 bg-gray-100 rounded mb-4" />
      <div className="mb-6">
        <div className="h-32 w-full bg-gray-200 rounded-lg mb-2" />
        <div className="h-10 w-32 bg-gray-100 rounded" />
      </div>

      <div className="h-5 w-32 bg-gray-100 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-6">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="mb-4">
            <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        ))}
        <div className="md:col-span-2 mb-4">
          <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
          <div className="h-16 w-full bg-gray-200 rounded" />
        </div>
      </div>

      <div className="flex justify-end gap-2 w-full mt-4">
        <div className="h-10 w-24 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
