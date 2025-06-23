import { useCallback, useMemo, useState } from "react";

export type FilterOptions = Record<string, string | string[] | undefined>;

export function useFilters(initialFilters: FilterOptions = {}) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const mappedFilters = useMemo(() => {
    return Object.entries(filters).reduce<FilterOptions>(
      (acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
  }, [filters]);

  const handleFiltersChange = useCallback(
    (key: string, value: string | string[] | undefined) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  return {
    filters,
    mappedFilters,
    handleFiltersChange,
    setFilters,
  };
}
