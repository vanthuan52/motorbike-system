import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { serviceCategoryActions } from "../store/service-category-slice";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import ServiceCategoryForm from "../components/service-category-form";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    detail: serviceCategory,
    loadingSingle,
    create,
    update,
    deletion,
    partialUpdate,
  } = useAppSelector((state: RootState) => state.serviceCategory);

  const mode: ENUM_PAGE_MODE = usePageMode();
  const isLoading =
    loadingSingle ||
    create.loading ||
    deletion.loading ||
    update.loading ||
    partialUpdate.loading;

  useEffect(() => {
    if (id && mode === ENUM_PAGE_MODE.EDIT) {
      dispatch(
        serviceCategoryActions.getServiceCategoryDetail({
          serviceCategoryId: id,
        })
      );
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(serviceCategoryActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới danh mục dịch vụ";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa danh mục dịch vụ";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết danh mục dịch vụ";
      default:
        return "Danh mục dịch vụ";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!serviceCategory && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">
            Không tìm thấy danh mục dịch vụ
          </h2>
        ) : (
          <ServiceCategoryForm mode={mode} initialValues={serviceCategory} />
        )}
      </div>
    </div>
  );
}
