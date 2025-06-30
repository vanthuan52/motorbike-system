import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { SkeletonCard } from "./SkeletonCard";
import PartTypeCard from "./part-type-card";
import { PartType } from "@/features/part-type/types";
import { TRANSLATION_FILES } from "@/lib/i18n";

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

export default function PartTypeList({
  loading,
  partTypes,
  direction,
  search,
  PAGE_SIZE,
}: {
  loading: boolean;
  partTypes: PartType[];
  direction: number;
  search: string;
  PAGE_SIZE: number;
}) {
  const t = useTranslations(TRANSLATION_FILES.PART_TYPE_PAGE);

  return (
    <div className={clsx("relative min-h-[500px]")}>
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={`${search}-${partTypes.length}-${partTypes[0]?._id ?? ""}`}
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
          ) : partTypes.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              {t("partTypeList.notFound")}
            </div>
          ) : (
            partTypes.map((cat) => <PartTypeCard key={cat._id} cat={cat} />)
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
