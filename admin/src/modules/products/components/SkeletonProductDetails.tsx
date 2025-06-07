export default function SkeletonProductDetails() {
  return (
    <div className="sm:px-4 mx-4 bg-white rounded-xl shadow p-6 mt-6 animate-pulse">
      <div className="flex gap-2 items-center">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
        <div className="h-8 w-52 bg-gray-200 rounded mb-6" />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 w-full flex flex-col items-center">
          <div className="w-full aspect-[16/12] bg-gray-200 rounded-lg mb-4" />
          <div className="flex gap-2 max-w-[300px] w-full">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="w-full h-[100px] bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
            </div>
          ))}
          <div className="md:col-span-2">
            <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
            <div className="h-16 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
