import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { partTypeActions } from "../store/part-types-slice";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import PartTypeForm from "../components/PartTypeForm";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { partType, loadingSingle, create, update, deletion, partialUpdate } =
    useAppSelector((state: RootState) => state.partTypes);

  const mode: ENUM_PAGE_MODE = usePageMode();
  const isLoading =
    loadingSingle ||
    create.loading ||
    deletion.loading ||
    update.loading ||
    partialUpdate.loading;

  useEffect(() => {
    if (id && mode === ENUM_PAGE_MODE.EDIT) {
      dispatch(partTypeActions.getPartTypeDetail({ partTypeId: id }));
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(partTypeActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới danh mục phụ tùng";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa danh mục phụ tùng";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết danh mục phụ tùng";
      default:
        return "danh mục phụ tùng";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!partType && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">
            Không tìm thấy danh mục phụ tùng
          </h2>
        ) : (
          <PartTypeForm mode={mode} initialValues={partType} />
        )}
      </div>
    </div>
  );
}
