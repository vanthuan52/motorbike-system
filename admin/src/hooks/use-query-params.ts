import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { pickBy } from "lodash";

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<Record<string, string | string[]>>(() =>
    Object.fromEntries([...searchParams])
  );

  const handleSetParams = (newParams: Record<string, string | string[]>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
    setSearchParams(pickBy({ ...newParams }));
  };

  return [params, handleSetParams] as const;
}
