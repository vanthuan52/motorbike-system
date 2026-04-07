"use client";

import React, { useState, useEffect } from "react";
import { Phone, MapPin, ArrowUp } from "lucide-react";
import { cn } from "@/utils/common.utils";
import Image from "next/image";

import ChatWidget from "../chatWidget";

export const FloatingAction = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility of back to top button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const actions = [
    {
      id: "phone",
      icon: <Phone size={22} className="text-white" />,
      href: "tel:+84123456789",
      label: "Điện thoại",
    },
    {
      id: "address",
      icon: <MapPin size={22} className="text-white" />,
      href: "https://maps.google.com",
      target: "_blank",
      label: "Địa chỉ",
    },
    {
      id: "zalo",
      icon: (
        <div className="relative flex size-[22px] items-center justify-center rounded-[8px] bg-white">
          <span className="text-[8px] font-bold tracking-tighter text-primary-500 mt-px">Zalo</span>
        </div>
      ),
      href: "https://zalo.me/0123456789",
      target: "_blank",
      label: "Zalo",
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[90] flex flex-col items-end gap-4">
      {/* Contact Info Group */}
      <div className="flex flex-col items-end gap-4">
        {/* Chat Widget integrated here */}
        <ChatWidget />
        
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            target={action.target}
            rel={action.target === "_blank" ? "noopener noreferrer" : undefined}
            title={action.label}
            className={cn(
              "flex size-12 items-center justify-center rounded-full bg-primary-500 shadow-[var(--shadow-md)]",
              "state-layer hover:shadow-[var(--shadow-lg)] active:shadow-[var(--shadow-md-active)]",
              "outline-none focus-visible:shadow-[var(--shadow-focus-ring)]",
              "transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105"
            )}
          >
            {action.icon}
          </a>
        ))}
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        title="Lên đầu trang"
        className={cn(
          "mt-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-secondary-800 shadow-[var(--shadow-md)]",
          "state-layer hover:shadow-[var(--shadow-lg)] active:shadow-[var(--shadow-md-active)]",
          "outline-none focus-visible:shadow-[var(--shadow-focus-ring)] text-white",
          "transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105",
          isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        )}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

