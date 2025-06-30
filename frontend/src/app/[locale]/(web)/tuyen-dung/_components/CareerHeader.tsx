import { motion } from "framer-motion";
import Image from "next/image";

export default function CareerHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[220px] md:h-[240px] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/motorbike/career-banner.png')" }}
    >
      <div className="absolute bottom-[-30px] sm:bottom-[-35px] md:bottom-[-40px] left-5 sm:left-30 lg:left-50 z-10">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-xl flex items-center justify-center shadow-lg">
          <Image
            src="/images/logo/logo.jpg"
            alt="Logo"
            width={48}
            height={48}
            className="object-contain md:w-[48px] md:h-[48px]"
            priority
          />
        </div>
      </div>
    </motion.div>
  );
}
