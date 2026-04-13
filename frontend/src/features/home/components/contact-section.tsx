"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock } from "lucide-react";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { cn } from "@/utils/common.utils";
import SectionHeading from "@/components/ui/section-heading";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M11.996 2C6.476 2 2 6.027 2 10.999c0 2.215 1.002 4.254 2.673 5.836-1.045 2.502-3.13 3.824-3.176 3.854-.15.103-.223.275-.184.448.04.173.18.3.36.31 3.447.16 6.37-1.12 8.1-2.072.716.143 1.488.223 2.227.223 5.52 0 10-4.027 10-8.999S17.516 2 11.996 2Zm2.548 10.985h-4.03l3.52-4.103c.313-.362.062-.916-.423-.916H9.176a.75.75 0 0 0 0 1.5h3.693l-3.52 4.1c-.31.36-.06.915.422.915h4.772a.75.75 0 0 0 0-1.5Z" />
  </svg>
);

export default function ContactSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.contactSection`);

  const contactItems = [
    {
      icon: MapPin,
      title: t("addressLabel"),
      desc: t("address"),
      link: null,
    },
    {
      icon: Phone,
      title: t("hotlineLabel"),
      desc: t("hotline"),
      link: "tel:0123456789",
    },
    {
      icon: Clock,
      title: t("workTimeLabel"),
      desc: t("workTime"),
      link: null,
    },
  ];

  return (
    <section
      className="relative bg-surface py-20 lg:py-28 overflow-hidden"
      id="contact"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100/50 rounded-full mix-blend-multiply blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary-100/50 rounded-full mix-blend-multiply blur-[120px] opacity-70 pointer-events-none" />

      <div className="container relative z-10">
        <SectionHeading title={t("title")} className="mb-16" />

        {/* Main Layout Card */}
        <div className="grid lg:grid-cols-5 gap-0 items-stretch bg-[#ffffff] backdrop-blur-xl rounded-3xl shadow-[var(--shadow-xl)] overflow-hidden">
          {/* Left: Contact Info */}
          <motion.div
            className="lg:col-span-2 p-8 md:p-12 lg:p-14 flex flex-col justify-between"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <div>
              <div className="mb-12">
                <h4 className="text-2xl font-bold text-text-primary mb-2">
                  Trò chuyện với chúng tôi
                </h4>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                  Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ khách hàng nhanh
                  chóng và tận tâm.
                </p>
              </div>

              <div className="space-y-8">
                {contactItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-5 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-primary-50 text-primary-600 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[var(--shadow-md)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[14px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        {item.title}
                      </h4>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-base font-bold text-text-primary hover:text-primary-600 transition-colors"
                        >
                          {item.desc}
                        </a>
                      ) : (
                        <p className="text-base font-bold text-text-primary">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-12 mt-12 border-t border-border">
              <p className="text-[13px] font-bold text-text-secondary uppercase tracking-widest mb-5">
                Theo dõi chúng tôi
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border text-text-secondary hover:bg-[#1877F2] hover:text-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <FacebookIcon className="w-5 h-5 fill-current" />
                </a>
                <a
                  href="https://zalo.me"
                  aria-label="Zalo"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border text-text-secondary hover:bg-[#0068FF] hover:text-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <ZaloIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border text-text-secondary hover:bg-[#FF0000] hover:text-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  aria-label="TikTok"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-surface border border-border text-text-secondary hover:bg-black hover:text-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <TiktokIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Map Integration */}
          <motion.div
            className="lg:col-span-3 w-full h-[400px] lg:h-auto min-h-[400px] relative overflow-hidden bg-surface"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2497746976566!2d106.6799836153345!3d10.791517161858927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292aa5b5d4b1%3A0xb497d880e6c9b450!2zMTIzIE5ndXnhu4VuIFbEg24gQ-G7rywgUXXDoW4gNSwgVGjDoG5oIHBo4buRIFRow6BuaCBQaOG7pSwgSOG7kyBDaMOidQ!5e0!3m2!1sen!2s!4v1700000000000"
              className="w-full h-full border-0 absolute inset-0"
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
