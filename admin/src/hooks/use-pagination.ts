import { useCallback, useState } from "react";
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

  const handlePaginationChange = useCallback((next: UsePaginationProps) => {
    setPagination((prev) => {
      if (prev.page === next.page && prev.perPage === next.perPage) return prev;
      return { ...prev, ...next };
    });
  }, []);

  return { pagination, handlePaginationChange };
}
