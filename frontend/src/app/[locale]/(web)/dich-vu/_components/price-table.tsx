"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

type Service = {
  nameKey: string;
  priceKey: string;
  noteKey?: string;
};

const services: Service[] = [
  {
    nameKey: "oilChange",
    priceKey: "oilPrice",
    noteKey: "oilNote",
  },
  {
    nameKey: "fullMaintenance",
    priceKey: "fullPrice",
    noteKey: "fullNote",
  },
  {
    nameKey: "sparkAirFilter",
    priceKey: "sparkPrice",
    noteKey: "sparkNote",
  },
  {
    nameKey: "brakeRepair",
    priceKey: "brakePrice",
    noteKey: "brakeNote",
  },
  {
    nameKey: "electricalRepair",
    priceKey: "electricalPrice",
    noteKey: "electricalNote",
  },
];

export default function PriceTable() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const lastScrollY = useRef(0);
  const t = useTranslations(
    `${TRANSLATION_FILES.SERVICE_PAGE}.priceTableSection`
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollDirection(currentY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
          {t("title")}
        </h2>

        <div className="space-y-4">
          {services.map((service, index) => (
            <FadeCard
              key={index}
              index={index}
              service={service}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
              scrollDirection={scrollDirection}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FadeCard({
  service,
  index,
  isOpen,
  onToggle,
  scrollDirection,
  t,
}: {
  service: Service;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  scrollDirection: "down" | "up";
  t: ReturnType<typeof useTranslations>;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          delay: index * 0.1,
          ease: "easeOut",
        },
      });
    } else {
      controls.start({
        opacity: 0,
        y: scrollDirection === "down" ? -30 : 30,
        scale: 0.95,
      });
    }
  }, [inView, controls, scrollDirection, index]);

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: scrollDirection === "down" ? -30 : 30,
        scale: 0.95,
      }}
      animate={controls}
      className="bg-white rounded-xl shadow-md overflow-hidden transition"
    >
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
      >
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isOpen ? 0.7 : 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center w-full"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t(service.nameKey)}
            </h3>
            <p className="text-sm text-gray-500">{t(service.priceKey)}</p>
          </div>
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-gray-500" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-500" />
          )}
        </motion.div>
      </button>

      {isOpen && service.noteKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-4 text-sm text-gray-600"
        >
          {t(service.noteKey)}
        </motion.div>
      )}
    </motion.div>
  );
}
