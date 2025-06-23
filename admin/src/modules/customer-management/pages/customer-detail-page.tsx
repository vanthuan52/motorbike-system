import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageInfo from "@/components/page-info";
import CustomerForm from "../components/customer-form";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { customerActions } from "../store/customer-slice";

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, isUpserted, isDeleted } = useAppSelector(
    (state: RootState) => state.customer
  );

  const mode: ENUM_PAGE_MODE = useMemo(() => {
    if (!id || id === ENUM_PAGE_MODE.CREATE) {
      return ENUM_PAGE_MODE.CREATE;
    }
    if (searchParams.get("view") === "true") {
      return ENUM_PAGE_MODE.VIEW;
    }
    return ENUM_PAGE_MODE.EDIT;
  }, [id, searchParams]);

  useEffect(() => {
    if (id && (mode === ENUM_PAGE_MODE.EDIT || mode === ENUM_PAGE_MODE.VIEW)) {
      dispatch(customerActions.getCustomerDetail({ customerId: id }));
    }

    return () => {
      dispatch(customerActions.resetCustomerDetail());
    };
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (isUpserted || isDeleted) {
      navigate(-1);
      dispatch(customerActions.resetState());
    }
  }, [isUpserted, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới Khách hàng";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa Khách hàng";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết Khách hàng";
      default:
        return "Khách hàng";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full">
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {loading &&
        (mode === ENUM_PAGE_MODE.EDIT || mode === ENUM_PAGE_MODE.VIEW) ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <CustomerForm mode={mode} />
        )}
      </div>
    </div>
  );
};

export default CustomerDetailPage;
