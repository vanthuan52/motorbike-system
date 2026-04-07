"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { TRANSLATION_FILES } from "@/lib/i18n";

const services = [
  {
    titleKey: "oilChangeTitle",
    descriptionKey: "oilChangeDesc",
    image: "/images/services/oil-change.png",
    priceKey: "oilChangePrice",
  },
  {
    titleKey: "fullMaintenanceTitle",
    descriptionKey: "fullMaintenanceDesc",
    image: "/images/services/full-maintenance.jpg",
    priceKey: "fullMaintenancePrice",
  },
  {
    titleKey: "sparkAirTitle",
    descriptionKey: "sparkAirDesc",
    image: "/images/services/spark-air.jpg",
    priceKey: "sparkAirPrice",
  },
  {
    titleKey: "brakeRepairTitle",
    descriptionKey: "brakeRepairDesc",
    image: "/images/services/brake-repair.jpg",
    priceKey: "brakeRepairPrice",
  },
  {
    titleKey: "electricalTitle",
    descriptionKey: "electricalDesc",
    image: "/images/services/electrical.jpg",
    priceKey: "electricalPrice",
  },
];

export default function ServiceList() {
  const t = useTranslations(
    `${TRANSLATION_FILES.SERVICE_PAGE}.serviceListSection`
  );

  return (
    <section className="py-16 bg-surface text-text-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          {t("title")}
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ZoomInCard key={index} service={service} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoomInCard({
  service,
  t,
}: {
  service: (typeof services)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });
    } else {
      controls.start({
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.3 },
      });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={controls}
      className="bg-surface shadow-[var(--shadow-lg)] rounded-[var(--radius-2xl)] overflow-hidden hover:shadow-[var(--shadow-xl-hover)] transition"
    >
      <div className="relative h-52">
        <Image
          src={service.image}
          alt={t(service.titleKey)}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{t(service.titleKey)}</h3>
        <p className="text-sm text-text-secondary mb-3">
          {t(service.descriptionKey)}
        </p>
        <span className="font-medium text-accent">
          {t(service.priceKey)}
        </span>
      </div>
    </motion.div>
  );
}
