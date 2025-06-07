
export default function SkeletonDetailPanel() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="flex gap-2">
                    <div className="w-24 h-8 bg-gray-200 rounded" />
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
            </div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
            <div className="space-y-2 mb-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                ))}
                <div className="flex flex-col gap-2 py-1">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-8 w-full bg-gray-100 rounded" />
                </div>
            </div>
            <div className="rounded-lg p-3 mb-3 bg-gray-50">
                <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-3 w-20 bg-gray-100 rounded" />
                        </div>
                        <div className="h-4 w-16 bg-gray-200 rounded ml-3" />
                    </div>
                ))}
                <div className="border-t my-2" />
                <div className="flex justify-between mt-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between mt-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="border-t my-2" />
                <div className="flex justify-between mt-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
    )
}
