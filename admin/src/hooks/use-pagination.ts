import { useState } from "react";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";

type UsePaginationProps = {
  page: number;
  perPage: number;
};

export default function usePagination({
  page = DEFAULT_PAGINATION_QUERY.page,
  perPage = DEFAULT_PAGINATION_QUERY.perPage,
}: UsePaginationProps) {
  const [pagination, setPagination] = useState<UsePaginationProps>({
    page,
    perPage,
  });

  const handlePaginationChange = (next: UsePaginationProps) => {
    setPagination((prev) => ({ ...prev, ...next }));
  };

  return { pagination, handlePaginationChange };
}
