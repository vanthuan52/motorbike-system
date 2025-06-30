export default function CareerDetailSkeletonPage() {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      {/* Header skeleton */}
      <div className="w-full bg-white shadow-sm py-6 mb-8">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Back link skeleton */}
        <div className="flex items-center mb-6 gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded-full" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Job details skeleton */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="h-8 w-2/3 bg-gray-200 rounded" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-28 bg-gray-200 rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <ul className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded-full" />
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-5 w-32 bg-gray-200 rounded" />
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-5 w-32 bg-gray-200 rounded" />
              </div>
            </div>
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded mt-1" />
            </div>
          </div>
          {/* Application form skeleton */}
          <div className="lg:col-span-5 border border-gray-200 p-6 rounded-lg space-y-4 bg-white">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-12 w-full bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-200 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-12 w-full bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-200 rounded" />
            </div>
            <div className="h-20 w-full bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-200 rounded" />
            <div className="h-12 w-full bg-gray-200 rounded" />
            <div className="flex justify-end">
              <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
