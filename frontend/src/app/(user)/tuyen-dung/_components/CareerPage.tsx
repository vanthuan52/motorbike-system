"use client";
import { useState } from "react";

import CareerHeader from "./CareerHeader";
import CareerSearchFilter from "./CareerSearchFilter";
import CareerJobList from "./CareerJobList";
import { careerJobs } from "../mocks/career";
import CompanyDescription from "./CompanyDescription";
import { PaginationFilter } from "@/interfaces/filter";
import { DEFAULT_PER_PAGE } from "@/constant/application";
import { useDebounce } from "@/hooks/useDebounce";
interface CareerJob extends PaginationFilter {
  job_type: string;
}
const defaultCareerJob: CareerJob = {
  search: "",
  page: 1,
  perPage: DEFAULT_PER_PAGE,
  status: null,
  job_type: "",
};
export default function CareerPage() {
  const [filter, setFilter] = useState(defaultCareerJob);
  const debouncedSearch = useDebounce(filter.search, 500);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      ...filter,
      search: e.target.value,
      page: 1,
    });
  };
  const handleType = (v: string) => {
    setFilter({
      ...filter,
      job_type: v,
      page: 1,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <CareerHeader />
      <div className="container mx-auto px-4 mt-4 sm:mt-8  py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CompanyDescription />
        <div className="space-y-4">
          <CareerSearchFilter
            search={filter.search}
            handleSearch={handleSearch}
            type={filter.job_type}
            setType={handleType}
          />
          <CareerJobList
            jobs={careerJobs}
            search={filter.search}
            type={filter.job_type}
            page={filter.page}
            setPage={(p: number) => setFilter({ ...filter, page: p })}
          />
        </div>
      </div>
    </div>
  );
}
