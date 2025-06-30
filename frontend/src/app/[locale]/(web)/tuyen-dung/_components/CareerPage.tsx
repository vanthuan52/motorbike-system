"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CareerHeader from "./CareerHeader";
import CareerSearchFilter from "./CareerSearchFilter";
import CareerJobList from "./CareerJobList";
import CompanyDescription from "./CompanyDescription";
import { PaginationFilter } from "@/interfaces/filter";
import { DEFAULT_PER_PAGE } from "@/constant/application";
import { useDebounce } from "@/hooks/useDebounce";
import { RootState } from "@/store";
import { hiringActions } from "@/features/hiring/store/hiring-slice";

interface CareerJob extends PaginationFilter {
  jobType: string | null;
}
const defaultCareerJob: CareerJob = {
  search: "",
  page: 1,
  perPage: DEFAULT_PER_PAGE,
  status: null,
  jobType: null,
};
export default function CareerPage() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(defaultCareerJob);

  const debouncedSearch = useDebounce(filter.search, 500);

  const { hiringList, loading, pagination } = useSelector(
    (state: RootState) => state.hiring
  );
  useEffect(() => {
    dispatch(
      hiringActions.getHiringList({
        search: debouncedSearch,
        page: filter.page,
        perPage: filter.perPage,
        status: filter.status ?? undefined,
      })
    );
  }, [dispatch, debouncedSearch, filter]);
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
      jobType: v,
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
            type={filter.jobType ?? undefined}
            setType={handleType}
          />
          <CareerJobList
            hiring={hiringList}
            page={filter.page}
            setPage={(p: number) => setFilter({ ...filter, page: p })}
            loading={loading}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
}
