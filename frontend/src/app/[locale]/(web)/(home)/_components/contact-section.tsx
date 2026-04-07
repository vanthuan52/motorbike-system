"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock } from "lucide-react";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function ContactSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.contactSection`);

  return (
    <section className="bg-surface-alt py-16" id="contact">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Contact info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <div className="flex items-start gap-4">
              <MapPin className="text-primary-700 shrink-0" />
              <div>
                <h4 className="font-semibold text-text-primary">{t("addressLabel")}</h4>
                <p className="text-text-secondary">{t("address")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-primary-700 shrink-0" />
              <div>
                <h4 className="font-semibold text-text-primary">{t("hotlineLabel")}</h4>
                <a href="tel:0123456789" className="text-primary-700 hover:text-primary-500 underline transition-colors duration-150">
                  {t("hotline")}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-primary-700 shrink-0" />
              <div>
                <h4 className="font-semibold text-text-primary">{t("workTimeLabel")}</h4>
                <p className="text-text-secondary">{t("workTime")}</p>
              </div>
            </div>

            <div className="flex gap-6 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="w-6 h-6 text-text-secondary hover:text-primary-700 transition-colors duration-150" />
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-6 h-6"
              >
                <Image
                  src="/images/zalo-icon.png"
                  alt="Zalo"
                  width={24}
                  height={24}
                  className="hover:opacity-80 transition"
                  style={{ objectFit: "contain" }}
                />
              </a>
            </div>
          </motion.div>

          {/* Right: Google Map */}
          <motion.div
            className="w-full h-[300px] md:h-full rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2497746976566!2d106.6799836153345!3d10.791517161858927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292aa5b5d4b1%3A0xb497d880e6c9b450!2zMTIzIE5ndXnhu4VuIFbEg24gQ-G7rywgUXXDoW4gNSwgVGjDoG5oIHBo4buRIFRow6BuaCBQaOG7pSwgSOG7kyBDaMOidQ!5e0!3m2!1sen!2s!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
