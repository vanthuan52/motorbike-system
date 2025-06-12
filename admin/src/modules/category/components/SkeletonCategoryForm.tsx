export default function SkeletonCategoryForm() {
    return (
        <div className="sm:px-4 mt-10 mb-3 sm:mt-10 sm:mb-3 lg:my-8 mx-4 bg-white rounded-xl shadow p-6 animate-pulse">
            <div className="flex gap-2 items-center mb-2 w-full">
                <div className="h-8 w-8 bg-gray-200 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded w-40" />
            </div>
            <div className="h-6 w-32 bg-gray-200 rounded mt-8 mb-4" />
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-24 w-24 bg-gray-200 rounded" />
                <div className="h-24 w-24 bg-gray-200 rounded" />
                <div className="h-24 w-24 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-32 bg-gray-200 rounded mt-8 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="h-20 bg-gray-200 rounded md:col-span-2" />
            </div>
            <div className="flex justify-end gap-2 w-full mt-4">
                <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
        </div>
    );
}