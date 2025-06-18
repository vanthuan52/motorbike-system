import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import CareerJobCard from "./CareerJobCard";
import { CareerJob, JobStatusEnum } from "../types";
import { DEFAULT_PER_PAGE } from "@/constant/application";

export default function CareerJobList({
  jobs,
  search,
  type,
  page,
  setPage,
}: {
  jobs: CareerJob[];
  search: string;
  type: string;
  page: number;
  setPage: (p: number) => void;
}) {
  const filtered = useMemo(() => {
    return jobs.filter(
      (job) =>
        job.status === JobStatusEnum.Published &&
        (type ? job.job_type === type : true) &&
        (search
          ? job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.description.toLowerCase().includes(search.toLowerCase())
          : true)
    );
  }, [jobs, search, type]);
  if (filtered.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Không tìm thấy công việc nào phù hợp.
      </div>
    );
  }
  const totalPages = Math.ceil(filtered.length / DEFAULT_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * DEFAULT_PER_PAGE,
    page * DEFAULT_PER_PAGE
  );

  return (
    <div>
      <AnimatePresence>
        {paged.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CareerJobCard job={job} />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={clsx(
              "w-9 h-9 rounded border text-sm font-semibold",
              page === p
                ? "bg-gray-300 text-white border-gray-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-500"
            )}
            onClick={() => setPage(p)}
            disabled={page === p}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
