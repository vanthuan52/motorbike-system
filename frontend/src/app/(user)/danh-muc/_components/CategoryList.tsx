import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { SkeletonCard } from "./SkeletonCard";
import CategoryCard from "./CategoryCard";
import { Category } from "@/features/category/types";

const listVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  }),
};

export default function CategoryList({
  loading,
  pagedCategories,
  direction,
  search,
  PAGE_SIZE,
}: {
  loading: boolean;
  pagedCategories: Category[];
  direction: number;
  search: string;
  PAGE_SIZE: number;
}) {
  return (
    <div className={clsx("relative min-h-[500px]")}>
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={`${search}-${pagedCategories.length}-${pagedCategories[0]?._id ?? ""}`}
          custom={direction}
          variants={listVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={clsx(
            "grid gap-8",
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            "pt-6"
          )}
        >
          {loading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : pagedCategories.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              Không tìm thấy danh mục phù hợp.
            </div>
          ) : (
            pagedCategories.map((cat) => (
              <CategoryCard key={cat._id} cat={cat} />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
