"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { RootState } from "@/store";
import { partTypeActions } from "@/features/part-type/store/part-type-slice";
import PartTypeList from "./part-type-list";
import Pagination from "./Pagination";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import PageHeading from "./PageHeading";
import SearchBar from "./SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { DEFAULT_PER_PAGE } from "@/constant/application";
import { PaginationFilter } from "@/interfaces/filter";
import { TRANSLATION_FILES } from "@/lib/i18n";

interface PartTypeFilter extends PaginationFilter {
  vehicle_company_id?: string | null;
}
const defaultPartTypeFilter: PartTypeFilter = {
  search: "",
  page: 1,
  perPage: DEFAULT_PER_PAGE,
  status: null,
  vehicle_company_id: null,
};

export default function PartTypePage() {
  const t = useTranslations(TRANSLATION_FILES.PART_TYPE_PAGE);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(defaultPartTypeFilter);
  const debouncedSearch = useDebounce(filter.search, 500);
  const [direction, setDirection] = useState(0);

  const {
    partTypes,
    loadingList: loading,
    pagination: paginationState,
  } = useSelector((state: RootState) => state.partType);

  useEffect(() => {
    dispatch(
      partTypeActions.getPartTypes({
        search: debouncedSearch,
        page: filter.page,
        perPage: filter.perPage,
      })
    );
  }, [dispatch, debouncedSearch, filter]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      ...filter,
      search: e.target.value,
      page: 1,
    });
    setDirection(0);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.partType") },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-auto sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] flex items-center"
        style={{
          backgroundImage: `url("/images/motorbike/category-banner.webp")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 text-white">
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-4"
            listClassName="text-white"
            itemClassName="text-white"
            linkClassName="hover:!underline"
            activeClassName="text-white font-bold"
            separator="/"
          />
          <PageHeading />
        </div>
      </motion.div>

      <div className="container sm:mx-auto px-8 sm:px-0 py-2 md:py-4">
        <SearchBar search={filter.search} handleSearch={handleSearch} />
        <PartTypeList
          loading={!!loading}
          partTypes={partTypes}
          direction={direction}
          search={filter.search}
          PAGE_SIZE={filter.perPage}
        />
        <Pagination
          page={filter.page}
          totalPages={paginationState?.total}
          loading={!!loading}
          setPage={(page) => setFilter((prev) => ({ ...prev, page }))}
          setDirection={setDirection}
        />
      </div>
    </div>
  );
}
