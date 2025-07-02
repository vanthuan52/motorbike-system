import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ENUM_PAGE_MODE } from "@/types/app.type";

/**
 * Custom hook to determine the current page mode (CREATE, VIEW, EDIT)
 *
 * Based on:
 * - `id` from useParams: If no id is present or the ID is 'create', it's CREATE mode.
 * - `searchParams`:if the 'view=true' parameter is present, it's VIEW mode.
 * - Defaults to EDIT mode if an ID is present and the 'view=true' parameter is absent.
 *
 * @returns {ENUM_PAGE_MODE} The current page mode.
 */
export const usePageMode = (): ENUM_PAGE_MODE => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const mode: ENUM_PAGE_MODE = useMemo(() => {
    if (!id) {
      return ENUM_PAGE_MODE.UNKNOWN;
    }
    if (id === ENUM_PAGE_MODE.CREATE) {
      return ENUM_PAGE_MODE.CREATE;
    }
    if (searchParams.get("view") === "true") {
      return ENUM_PAGE_MODE.VIEW;
    }
    return ENUM_PAGE_MODE.EDIT;
  }, [id, searchParams]);

  return mode;
};
