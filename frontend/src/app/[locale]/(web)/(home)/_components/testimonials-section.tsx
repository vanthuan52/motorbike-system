"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

interface Testimonial {
  name: string;
  contentKey: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Nguyễn Văn Hùng",
    contentKey: "nguyenContent",
    avatar: "/images/avatar/avatar.png",
  },
  {
    name: "Trần Thị Cẩm Tú",
    contentKey: "tranContent",
    avatar: "/images/avatar/avatar.png",
  },
  {
    name: "Lê Minh Tuấn",
    contentKey: "leContent",
    avatar: "/images/avatar/avatar.png",
  },
  {
    name: "Phạm Hà Linh",
    contentKey: "phamContent",
    avatar: "/images/avatar/avatar.png",
  },
];

export default function TestimonialsSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.testimonialsSection`);

  return (
    <section className="bg-surface py-20" id="testimonials">
      <div className="container mx-auto">
        <SectionHeading title={t("title")} className="mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((tItem, idx) => (
            <motion.div
              key={idx}
              className="bg-surface-alt border border-border p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md-hover)] transition-all duration-300 flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-14 h-14 mb-2">
                  <Image
                    src={tItem.avatar}
                    alt={tItem.name}
                    className="rounded-full object-contain p-[16px] ring-2 ring-primary-100 bg-surface"
                    fill
                    sizes="56px"
                  />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {tItem.name}
                </h3>
              </div>
              <motion.p
                className="text-text-secondary text-sm"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.18 + 0.1 * idx,
                  ease: "easeOut",
                }}
              >
                {`${t(tItem.contentKey)}`}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
