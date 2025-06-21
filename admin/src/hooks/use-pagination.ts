import { useState } from "react";

type PaginationState = {
  page?: number;
  perPage?: number;
};

export default function usePagination({
  page = 1,
  perPage = 20,
}: PaginationState) {
  const [pagination, setPagination] = useState<PaginationState>({
    page,
    perPage,
  });

  const handlePaginationChange = (next: PaginationState) => {
    setPagination((prev) => ({ ...prev, ...next }));
  };

  return { pagination, handlePaginationChange };
}
