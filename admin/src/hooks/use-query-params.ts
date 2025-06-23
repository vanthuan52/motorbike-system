import { useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { pickBy } from "lodash";
import { FilterOptions } from "./use-filters";

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<FilterOptions>(() =>
    Object.fromEntries([...searchParams])
  );

  const handleSetParams = (newParams: FilterOptions) => {
    setParams((prev) => ({ ...prev, ...newParams }));
    setSearchParams(pickBy({ ...newParams }) as URLSearchParamsInit);
  };

  return [params, handleSetParams] as const;
}
