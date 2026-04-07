import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import CareerJobCard from "./CareerJobCard";
import { ApiResponsePagination } from "@/types/api.type";
import { Hiring } from "@/features/hiring/types";

interface CareerJobListProps {
  hiring: Hiring[];
  page: number;
  setPage: (p: number) => void;
  loading: boolean;
  pagination?: ApiResponsePagination;
}

export default function CareerJobList({
  hiring,
  page,
  setPage,
  loading,
  pagination,
}: CareerJobListProps) {
  const totalPages = pagination?.totalPage ?? 0;

  return (
    <div>
      {loading ? (
        <div className="text-center py-8 text-text-muted">
          Đang tải dữ liệu...
        </div>
      ) : hiring.length === 0 ? (
        <div className="text-center py-8 text-text-muted">
          Không có công việc nào phù hợp.
        </div>
      ) : (
        <AnimatePresence>
          {hiring.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CareerJobCard job={job} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={clsx(
                "w-9 h-9 rounded border text-sm font-semibold",
                page === p
                  ? "bg-secondary-900 text-white border-secondary-900"
                  : "bg-surface text-text-secondary border-border-strong hover:bg-bg-soft hover:border-text-muted"
              )}
              onClick={() => setPage(p)}
              disabled={page === p}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
