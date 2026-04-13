import { motion } from "framer-motion";

export function PartTypeDetailsSkeleton() {
  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start"
      >
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-8 w-2/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-5 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-5 w-5/6 bg-gray-200 animate-pulse rounded" />
          <div className="h-5 w-4/6 bg-gray-200 animate-pulse rounded" />
          <div className="flex gap-2 mt-6">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
