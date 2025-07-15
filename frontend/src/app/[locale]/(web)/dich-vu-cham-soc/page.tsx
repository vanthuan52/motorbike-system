"use client";
import React, { useEffect, useState } from "react";
import FilterSidebar from "@/app/[locale]/(web)/dich-vu-cham-soc/_components/FilterSidebar";
import ServiceListSection from "./_components/ServiceListSection";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { SkeletonCard } from "./_components/SkeletonCard";

export default function ServiceCarePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // giả lập loading 1s
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className='container sm:mx-auto py-5'>
      <div className='min-h-screen bg-gray-50'>
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Dịch vụ chăm sóc" },
          ]}
          className='mb-2 sm:mb-3 lg:mb-4'
        />
        <div className='mx-auto py-8'>
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='w-full lg:w-64 '>
              <FilterSidebar />
            </div>
            <div className='flex-1'>
              {isLoading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <SkeletonCard key={idx} />
                  ))}
                </div>
              ) : (
                <ServiceListSection filterType={""} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
