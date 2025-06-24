import { ApiResponsePagination } from "@/types/api.type";

export const PAGINATION_QUERY_INITIAL_STATE: ApiResponsePagination = {
  search: "",
  availableSearch: [],
  page: 1,
  perPage: 20,
  orderBy: "",
  orderDirection: "",
  availableOrderBy: [],
  availableOrderDirection: [],
  total: 20,
  totalPage: 1,
};
