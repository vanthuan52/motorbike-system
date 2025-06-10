/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

export default function CategoryCard({ cat }: { cat: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 6px 24px rgba(0,0,0,0.1)" }}
      className={clsx("flex flex-col", "group")}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden border border-gray-300">
        <Image
          src={cat.image}
          alt={cat.name}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-4 flex flex-col justify-between gap-4">
        <div className="text-xl font-semibold text-gray-800">{cat.name}</div>
        <div className="flex items-center gap-2 text-sm text-black font-normal">
          <CustomLink
            href={`/danh-muc/${cat.slug}`}
            className="hover:!underline transition"
          >
            Xem chi tiết
          </CustomLink>
          <span>|</span>
          <CustomLink
            href={`/san-pham?danh-muc=${cat.slug}`}
            className="hover:!underline transition"
          >
            Xem sản phẩm
          </CustomLink>
        </div>
      </div>
    </motion.div>
  );
}
