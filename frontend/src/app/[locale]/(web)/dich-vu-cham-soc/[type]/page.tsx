"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import Link from "next/link";
import {
  getServiceData,
  getRelatedServices,
  Service,
  RelatedService,
} from "../mocks/service-detail";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { SkeletonCard } from "../_components/SkeletonCard";

export default function ServiceTypePage() {
  const params = useParams();
  const type = params?.type as string;
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // load data
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [type]);

  const serviceData: Service = getServiceData(type);
  const relatedServices: RelatedService[] = getRelatedServices(type);

  return (
    <section className='container sm:mx-auto py-5'>
      <div className='min-h-screen bg-gray-50'>
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Dịch vụ chăm sóc", href: "/dich-vu-cham-soc" },
            { label: serviceData.name },
          ]}
          className='mb-4'
        />

        <div className='mx-auto py-8'>
          {/* Nếu loading */}
          {isLoading ? (
            <>
              {/* Skeleton cho service detail */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                <SkeletonCard />
                <SkeletonCard />
              </div>

              {/* Skeleton cho related services */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Service Detail Section */}
              <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                  {/* Left - Service Image */}
                  <div className='aspect-square bg-gray-200 rounded-lg overflow-hidden'>
                    <img
                      src={serviceData.image}
                      alt={serviceData.name}
                      className='w-full h-full object-cover'
                    />
                  </div>

                  {/* Right - Service Information */}
                  <div className='space-y-6'>
                    <h1 className='text-2xl lg:text-3xl font-bold text-gray-900'>
                      {serviceData.name}
                    </h1>

                    <div className='flex items-center gap-2'>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(serviceData.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-lg font-semibold text-gray-900'>
                        {serviceData.rating}
                      </span>
                      <span className='text-gray-500'>
                        ({serviceData.reviewCount} đánh giá)
                      </span>
                    </div>

                    <div className='text-2xl font-bold'>
                      {serviceData.price}
                    </div>

                    <div className='border border-gray-200 rounded-lg'>
                      <button
                        onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                        className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors'
                      >
                        <span className='font-medium text-gray-900'>
                          Mô tả dịch vụ
                        </span>
                        {isDescriptionOpen ? (
                          <ChevronUp className='w-5 h-5 text-gray-400' />
                        ) : (
                          <ChevronDown className='w-5 h-5 text-gray-400' />
                        )}
                      </button>
                      {isDescriptionOpen && (
                        <div className='px-4 pb-4 text-gray-600 leading-relaxed'>
                          {serviceData.description}
                        </div>
                      )}
                    </div>

                    <button className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors'>
                      Chọn dịch vụ
                    </button>
                  </div>
                </div>
              </div>

              {/* Related Services */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    Dịch vụ liên quan
                  </h2>
                  <Link
                    href='/dich-vu-cham-soc'
                    className='text-blue-600 hover:text-blue-700 font-medium'
                  >
                    Xem tất cả
                  </Link>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {relatedServices.map(service => (
                    <Link
                      key={service.id}
                      href={`/dich-vu-cham-soc/${service.slug}`}
                      className='group cursor-pointer'
                    >
                      <div className='bg-gray-50 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow'>
                        <div className='aspect-square bg-gray-200'>
                          <img
                            src={service.image}
                            alt={service.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='p-4 '>
                          <h3 className='font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
                            {service.name}
                          </h3>
                          <div className='flex items-center gap-1 mb-2'>
                            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                            <span className='text-sm text-gray-600'>
                              {service.rating}
                            </span>
                          </div>
                          <p className=' font-semibold'>{service.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
