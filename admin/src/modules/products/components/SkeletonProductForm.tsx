export default function SkeletonProductForm() {
  return (
    <div className="sm:px-4 my-10 mx-4 bg-white rounded-xl shadow p-6 animate-pulse">
      <div className="flex gap-2 items-center mb-6 w-full">
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="sm:text-2xl font-bold flex-1">
          <div className="h-8 w-60 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="sm:col-span-2 md:col-span-1 w-full max-h-[400px] sm:max-h-[600px] flex flex-col items-center">
          <div className="w-full aspect-[16/12] bg-gray-200 rounded-lg mb-4" />
          <div className="w-32 h-10 bg-gray-100 rounded mt-2" />
        </div>
        <div className="sm:col-span-2 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="mb-2">
              <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          ))}
          <div className="md:col-span-2">
            <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
            <div className="h-16 w-full bg-gray-200 rounded" />
          </div>
        </div>
        <div className="sm:col-span-2 md:col-span-3 flex gap-2 mt-4">
          <div className="h-10 w-24 bg-gray-300 rounded" />
          <div className="h-10 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
