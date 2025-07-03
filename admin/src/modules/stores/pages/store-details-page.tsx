import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { storeActions } from "../store/stores-slice";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import StoreForm from "../components/StoreForm";

export default function StoreDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { store, loadingSingle, create, update, deletion, partialUpdate } =
    useAppSelector((state: RootState) => state.stores);

  const mode: ENUM_PAGE_MODE = usePageMode();
  const isLoading =
    loadingSingle ||
    create.loading ||
    deletion.loading ||
    update.loading ||
    partialUpdate.loading;

  useEffect(() => {
    if (id && mode === ENUM_PAGE_MODE.EDIT) {
      dispatch(storeActions.getStoreDetail({ storeId: id }));
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(storeActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới cửa hàng";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa cửa hàng";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết cửa hàng";
      default:
        return "Cửa hàng";
    }
  }, [mode]);

  return (
    <div className='w-full min-h-full relative'>
      {isLoading && <LocalSpinner text='Loading...' />}
      <div className='px-4 pt-3 pb-14 flex flex-col gap-3'>
        <PageInfo name={pageName} />
        {!store && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className='text-center text-lg'>Không tìm thấy cửa hàng</h2>
        ) : (
          <StoreForm mode={mode} initialValues={store} />
        )}
      </div>
    </div>
  );
}
