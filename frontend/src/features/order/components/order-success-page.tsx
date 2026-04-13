"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Truck,
  Headphones,
  ShieldCheck,
  ShoppingBag,
  FileText,
  Package,
  CreditCard,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import { Link, TRANSLATION_FILES } from "@/lib/i18n";

/* ── Confetti canvas ── */
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      "#2563eb",
      "#f59e0b",
      "#10b981",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
    ];

    type Particle = {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    };

    const particles: Particle[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    }));

    let animId: number;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Fade out after 120 frames
        if (frame > 120) {
          p.opacity = Math.max(0, p.opacity - 0.008);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (particles.some((p) => p.opacity > 0)) {
        animId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}

/* ── Main component ── */
export default function OrderSuccessPage() {
  const t = useTranslations(TRANSLATION_FILES.ORDER_SUCCESS);

  const orderId = useMemo(
    () => `MS-${Date.now().toString(36).toUpperCase()}`,
    [],
  );
  const orderDate = useMemo(
    () =>
      new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [],
  );

  const features = [
    {
      icon: Truck,
      title: t("features.delivery.title"),
      desc: t("features.delivery.desc"),
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Headphones,
      title: t("features.support.title"),
      desc: t("features.support.desc"),
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      icon: ShieldCheck,
      title: t("features.warranty.title"),
      desc: t("features.warranty.desc"),
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <>
      <ConfettiCanvas />

      <div className="bg-bg-soft min-h-screen">
        <div className="container py-12 sm:py-16">
          <div className="max-w-2xl mx-auto">
            {/* ── Success hero ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center mb-10"
            >
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2,
                }}
                className="relative inline-flex items-center justify-center mb-6"
              >
                {/* Pulse rings */}
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute w-24 h-24 rounded-full bg-success"
                />
                <motion.div
                  animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5,
                  }}
                  className="absolute w-24 h-24 rounded-full bg-success"
                />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center shadow-lg">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <CheckCircle2
                      size={48}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles size={20} className="text-amber-400" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                    {t("title")}
                  </h1>
                  <Sparkles size={20} className="text-amber-400" />
                </div>
                <p className="text-base text-primary-500 font-medium mb-3">
                  {t("subtitle")}
                </p>
                <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                  {t("description")}
                </p>
              </motion.div>
            </motion.div>

            {/* ── Order info card ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-surface rounded-2xl border border-border p-6 sm:p-8 mb-6"
            >
              <h2 className="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
                <FileText size={18} className="text-primary-500" />
                {t("orderInfo.title")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">
                      {t("orderInfo.orderId")}
                    </p>
                    <p className="text-sm font-bold text-text-primary font-mono">
                      {orderId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">
                      {t("orderInfo.date")}
                    </p>
                    <p className="text-sm font-semibold text-text-primary">
                      {orderDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <CreditCard size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">
                      {t("orderInfo.payment")}
                    </p>
                    <p className="text-sm font-semibold text-text-primary">
                      {t("orderInfo.paymentValue")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Truck size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">
                      {t("orderInfo.status")}
                    </p>
                    <p className="text-sm font-semibold text-success">
                      {t("orderInfo.statusValue")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Features ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-surface rounded-xl border border-border p-5 text-center hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mx-auto mb-3`}
                  >
                    <f.icon size={22} className={f.color} />
                  </div>
                  <p className="text-sm font-semibold text-text-primary mb-1">
                    {f.title}
                  </p>
                  <p className="text-xs text-text-muted">{f.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* ── Action buttons ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                href="/phu-tung"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 active:bg-primary-700 transition-all shadow-sm hover:shadow-md"
              >
                <ShoppingBag size={18} />
                {t("actions.continueShopping")}
              </Link>
              <Link
                href="/lich-su-mua-hang"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border-2 border-border text-text-secondary font-semibold text-sm hover:border-primary-300 hover:text-primary-500 transition-all"
              >
                <FileText size={18} />
                {t("actions.viewOrders")}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
