"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice } from "@/utils/currency.helper";

export interface ServiceCardData {
  id: number;
  name: string;
  slug: string;
  rating: number;
  price: string | number;
  image: string;
  description?: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
  /** href prefix, default "/dich-vu" */
  basePath?: string;
}

export function ServiceCard({
  service,
  basePath = "/dich-vu",
}: ServiceCardProps) {
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
      controls.start({ opacity: 0, scale: 0.9, transition: { duration: 0.3 } });
    }
  }, [inView, controls]);

  return (
    <Link
      href={`${basePath}/${service.slug}`}
      title={service.name}
      className="group"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={controls}
        className="bg-surface shadow-[var(--shadow-lg)] rounded-[var(--radius-2xl)] overflow-hidden hover:shadow-[var(--shadow-xl-hover)] transition h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-semibold mb-2 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
            {service.name}
          </h3>
          {service.description && (
            <p className="text-sm text-text-secondary mb-3 line-clamp-2 flex-1">
              {service.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-accent font-medium text-sm">
              Từ {formatPrice(service.price)}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="text-sm font-medium text-text-primary">
                {service.rating}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
