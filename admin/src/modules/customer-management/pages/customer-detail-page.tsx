import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageInfo from "@/components/page-info";
import CustomerForm from "../components/customer-form";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { customerActions } from "../store/customer-slice";
import { LocalSpinner } from "@/components/ui/local-spinner";
import { usePageMode } from "@/hooks/use-page-mode";

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    user: customer,
    loadingSingle,
    create,
    update,
    deletion,
    partialUpdate,
  } = useAppSelector((state: RootState) => state.customer);

  const mode: ENUM_PAGE_MODE = usePageMode();
  const isLoading =
    loadingSingle ||
    create.loading ||
    deletion.loading ||
    update.loading ||
    partialUpdate.loading;

  useEffect(() => {
    if (id && mode === ENUM_PAGE_MODE.EDIT) {
      dispatch(customerActions.getCustomerDetail({ customerId: id }));
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(customerActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới khách hàng";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa khách hàng";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết khách hàng";
      default:
        return "Khách hàng";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!customer && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">Không tìm thấy khách hàng</h2>
        ) : (
          <CustomerForm mode={mode} initialValue={customer} />
        )}
      </div>
    </div>
  );
};

export default CustomerDetailPage;
