import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { PartType } from "@/features/part-type/types";
import { ROUTER_PATH } from "@/constant/router-path";
import { getValidImageSrc } from "@/utils/getValidImageSrc";

export default function PartTypeCard({ cat }: { cat: PartType }) {
  const t = useTranslations("partTypePage.partTypeCard");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 6px 24px rgba(0,0,0,0.1)" }}
      className={clsx("flex flex-col", "group")}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden border border-gray-300">
        <Image
          src={getValidImageSrc(cat.photo)}
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
            href={`${ROUTER_PATH.PART_TYPE}/${cat.slug}`}
            className="hover:!underline transition"
          >
            {t("viewDetail")}
          </CustomLink>
          <span>|</span>
          <CustomLink
            href={`${ROUTER_PATH.PRODUCT}?danh-muc=${cat.slug}`}
            className="hover:!underline transition"
          >
            {t("viewProduct")}
          </CustomLink>
        </div>
      </div>
    </motion.div>
  );
}
