export const SkeletonCard = () => (
    <div className="relative bg-white rounded-2xl rounded-tl-[40px] shadow-md min-h-[180px] flex flex-col sm:flex-row gap-4 animate-pulse overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-5 w-full sm:w-4/5">
            <div>
                <div className="h-8 w-2/3 bg-gray-200 rounded mb-2" />
            </div>
            <div className="flex gap-2 mt-4 w-full">
                <div className="h-9 w-28 bg-gray-200 rounded-[30px]" />
                <div className="h-9 w-32 bg-gray-100 rounded-[30px]" />
            </div>
        </div>
        <div className="sm:block absolute sm:-top-10 sm:-right-20 z-10 w-[200px] h-[200px] p-2 flex items-center justify-center">
            <div className="w-full h-full bg-gray-100 rounded-xl" />
        </div>
        <span className="absolute left-4 right-4 bottom-0 h-1 rounded bg-gray-200" />
    </div>
);
