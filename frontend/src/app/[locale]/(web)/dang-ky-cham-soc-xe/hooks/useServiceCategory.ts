import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serviceCategoryActions } from "@/features/service-category/store/service-category-slice";
import { RootState } from "@/store";

export const useServiceCategory = () => {
  const dispatch = useDispatch();
  const { list: serviceCategories, loadingList: loadingServiceCategories } =
    useSelector((state: RootState) => state.serviceCategory);

  useEffect(() => {
    dispatch(
      serviceCategoryActions.getServiceCategories({
        search: "",
        page: 1,
        perPage: 100,
      })
    );
  }, [dispatch]);

  return {
    serviceCategories,
    loadingServiceCategories,
  };
};
