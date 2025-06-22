"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Workflow } from "lucide-react";

const TechnologySection = () => {
  const t = useTranslations("aboutPage.technologySection");

  const technologies = [0, 1, 2].map((i) => ({
    title: t(`technologies.${i}.title`),
    description: t(`technologies.${i}.description`),
    image: t(`technologies.${i}.image`),
  }));

  const steps = [0, 1, 2, 3, 4].map((i) => t(`workflowSteps.${i}`));

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h2>

        {/* Technologies */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {technologies.map((tech, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 * idx, ease: "easeOut" }}
            >
              <div className="relative w-full h-48">
                <Image
                  src={tech.image}
                  alt={tech.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={idx === 0}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {tech.title}
                </h3>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow */}
        <motion.div
          className="bg-indigo-50 p-10 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h3
            className="text-2xl font-semibold text-indigo-800 mb-6 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <Workflow className="w-6 h-6" />
            {t("workflowTitle")}
          </motion.h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-3 text-base">
            {steps.map((step, idx) => (
              <motion.li
                key={idx}
                className="leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * idx,
                  ease: "easeOut",
                }}
              >
                {step}
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologySection;
