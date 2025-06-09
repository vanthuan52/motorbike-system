import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

export default function CategoryCard({ cat }: { cat: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 6px 24px rgba(0,0,0,0.1)" }}
      className={clsx(
        "relative bg-white rounded-2xl rounded-tl-[40px] shadow-md",
        "flex flex-col-reverse lg:flex-row gap-4",
        "p-4 md:p-6",
        "group"
      )}
    >
      <div className="w-full lg:w-4/5 flex flex-col justify-between">
        <div>
          <div className="font-semibold text-xl md:text-2xl lg:text-3xl mb-1 break-words">
            {cat.name}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4 w-3/4">
          <CustomLink
            href={`/danh-muc/${cat.slug}`}
            className="flex items-center gap-1 justify-center px-1 sm:px-3 py-1.5 border border-white bg-orange-400 !text-white font-medium hover:bg-orange-300 transition rounded-[30px] text-sm"
          >
            Xem chi tiết
            <FaChevronRight className="text-xs" />
          </CustomLink>
          <CustomLink
            href={`/san-pham?danh-muc=${cat.slug}`}
            className="flex items-center gap-1 justify-center px-1 sm:px-3 py-1.5 border border-orange-400 rounded-[30px] bg-white !text-orange-600 font-medium hover:bg-gray-100 transition text-sm"
          >
            Xem sản phẩm
            <FaChevronRight className="text-xs" />
          </CustomLink>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={clsx(
          "relative mx-auto",
          "w-[150px] h-[150px] md:w-[180px] md:h-[180px] xl:w-[200px] xl:h-[200px]",
          "flex items-center justify-center",
          "lg:absolute lg:-top-10 lg:-right-20 z-10"
        )}
      >
        <Image
          src={cat.image}
          alt={cat.name}
          className="object-contain w-full h-full"
          priority
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>

      <span
        className={clsx(
          "absolute left-4 right-4 bottom-0 h-1 rounded bg-orange-400",
          "transition-all duration-300",
          "group-hover:left-1/2 group-hover:right-1/2"
        )}
        style={{ transitionProperty: "left, right, width" }}
      />
    </motion.div>
  );
}
