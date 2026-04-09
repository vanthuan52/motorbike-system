"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  hideUnderline?: boolean;
  align?: "left" | "center" | "right";
}

export default function SectionHeading({
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  hideUnderline = false,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-2xl ${
        align === "center" ? "text-center mx-auto" : ""
      } ${align === "right" ? "text-right ml-auto" : ""} ${
        align === "left" ? "text-left" : ""
      } ${className}`}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-2xl md:text-3xl font-bold mb-4 ${
          titleClassName ? titleClassName : "text-gray-900"
        }`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`mb-6 ${subtitleClassName ? subtitleClassName : "text-gray-600/90"}`}
        >
          {subtitle}
        </motion.p>
      )}
      {!hideUnderline && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`w-24 h-1 bg-primary-600 rounded-full ${
            align === "center" ? "mx-auto" : ""
          } ${align === "right" ? "ml-auto" : ""}`}
        />
      )}
    </div>
  );
}
