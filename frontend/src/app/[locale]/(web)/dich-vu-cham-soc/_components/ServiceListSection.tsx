"use client";
import React, { useState, useEffect } from "react";
import { getRelatedServices, RelatedService } from "../mocks/service-detail";
import Pagination from "./Pagination";
import SearchBar from "../../danh-muc/_components/SearchBar";
import SortBar from "./SortBar";
import ServiceCard from "./ServiceCard";

const PAGE_SIZE = 6;

type Props = {
  filterType?: string;
};

const ServiceListSection: React.FC<Props> = ({ filterType }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc">(
    "relevance"
  );
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  // Data mock
  const allServices: RelatedService[] = getRelatedServices(filterType || "");

  // Filter
  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = !filterType || service.slug === filterType;
    return matchesSearch && matchesFilter;
  });

  // Sort
  const sortedServices = [...filteredServices].sort((a, b) => {
    // Extract number from price string
    const getPriceValue = (price: string) =>
      parseFloat(price.replace(/[^0-9]/g, "")) || 0;

    if (sort === "price-asc") {
      return getPriceValue(a.price) - getPriceValue(b.price);
    }
    if (sort === "price-desc") {
      return getPriceValue(b.price) - getPriceValue(a.price);
    }
    return 0; // relevance
  });

  // Pagination
  const totalPages = Math.ceil(sortedServices.length / PAGE_SIZE);
  const pagedServices = sortedServices.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset page khi filter/search thay đổi
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterType, sort]);

  return (
    <div className='flex-1'>
      {/* Search Bar */}
      <div className='mb-6'>
        <SearchBar
          search={searchQuery}
          handleSearch={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sort & Layout */}
      <div className='mb-6'>
        <SortBar
          sort={sort}
          onChange={setSort}
          total={filteredServices.length}
          showing={pagedServices.length}
          layout={layout}
          onLayoutChange={setLayout}
        />
      </div>

      {/* Services */}
      {pagedServices.length > 0 ? (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-6"
          }
        >
          {pagedServices.map(service => (
            <ServiceCard
              key={service.id}
              service={{
                slug: service.slug,
                image: service.image,
                name: service.name,
                rating: service.rating,
                price: service.price,
              }}
              layout={layout}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-16'>
          <div className='text-text-muted text-6xl mb-4'>🔍</div>
          <h3 className='text-lg font-medium text-text-primary mb-2'>
            Không tìm thấy dịch vụ
          </h3>
          <p className='text-text-muted'>
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination current={page} total={totalPages} onChange={setPage} />
      )}
    </div>
  );
};

export default ServiceListSection;
