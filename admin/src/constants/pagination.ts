import { ENUM_ORDER_DIRECTION } from "@/types/base.type";

export const DEFAULT_PAGINATION_QUERY = {
  search: "",
  page: 1,
  perPage: 10,
  orderBy: "createdAt",
  orderDirection: ENUM_ORDER_DIRECTION.ASC,
};
