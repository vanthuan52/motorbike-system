"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

type Combo = {
  titleKey: string;
  servicesKey: string[];
  priceKey: string;
  noteKey: string;
};

const combos: Combo[] = [
  {
    titleKey: "combo99Title",
    servicesKey: ["combo99Item1", "combo99Item2"],
    priceKey: "combo99Price",
    noteKey: "combo99Note",
  },
  {
    titleKey: "fullTitle",
    servicesKey: ["fullItem1", "fullItem2", "fullItem3", "fullItem4"],
    priceKey: "fullPrice",
    noteKey: "fullNote",
  },
  {
    titleKey: "newUserTitle",
    servicesKey: ["newUserItem1"],
    priceKey: "newUserPrice",
    noteKey: "newUserNote",
  },
];

export default function ServiceCombos() {
  const t = useTranslations("comboServicepage");

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
          {t("title")}
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo, index) => (
            <SlideInCard key={index} combo={combo} index={index} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SlideInCard({
  combo,
  index,
  t,
}: {
  combo: Combo;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: 0.6,
          delay: index * 0.2,
          ease: "easeOut",
        },
      });
    } else {
      controls.start({
        opacity: 0,
        y: 30,
        x: index % 2 === 0 ? -20 : 20,
      });
    }
  }, [inView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, x: index % 2 === 0 ? -20 : 20 }}
      animate={controls}
      className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition border-t-4 border-yellow-400"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {t(combo.titleKey)}
      </h3>

      <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
        {combo.servicesKey.map((key, i) => (
          <li key={i}>{t(key)}</li>
        ))}
      </ul>

      <div className="text-lg font-bold text-yellow-600 mb-1">
        {t(combo.priceKey)}
      </div>
      <div className="text-sm text-gray-500 italic">{t(combo.noteKey)}</div>
    </motion.div>
  );
}
