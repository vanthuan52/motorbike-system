"use client";

import { motion } from "framer-motion";
import { Wrench, ShieldCheck, Car, Timer, BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const FeaturedServices = () => {
  const t = useTranslations("featuredServices");

  const services = [
    {
      icon: <Wrench className="w-8 h-8 text-white" />,
      title: t("services.0.title"),
      description: t("services.0.description"),
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: t("services.1.title"),
      description: t("services.1.description"),
    },
    {
      icon: <Car className="w-8 h-8 text-white" />,
      title: t("services.2.title"),
      description: t("services.2.description"),
    },
  ];

  const reasons = [
    {
      icon: <Timer className="w-6 h-6 text-indigo-600" />,
      title: t("reasons.0"),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: t("reasons.1"),
    },
    {
      icon: <BadgeCheck className="w-6 h-6 text-indigo-600" />,
      title: t("reasons.2"),
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container">
        <motion.h2
          className="text-3xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("heading")}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-indigo-600 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-500 p-3 rounded-full">
                  {service.icon}
                </div>
              </div>
              <motion.h3
                className="text-xl font-semibold text-center mb-2"
                whileHover={{
                  scale: 1.08,
                  color: "#fbbf24",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {service.title}
              </motion.h3>
              <p className="text-center text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.h3
          className="text-2xl font-semibold text-center text-gray-800 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {t("whyChooseUs")}
        </motion.h3>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className="p-3 bg-indigo-100 rounded-full">
                {reason.icon}
              </div>
              <p className="text-gray-700 font-medium">{reason.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
