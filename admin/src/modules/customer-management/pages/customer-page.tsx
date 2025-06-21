import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "@/components/ui/table/table";
import SelectField from "@/components/ui/select-field";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { PaginationFilter } from "@/interfaces/filter";
import { RootState } from "@/store";
import { customersActions } from "../store/customers-slice";
import { ENUM_USER_GENDER, ENUM_USER_STATUS, User } from "../types";
import { columns } from "../components/customer-column";
import { PageHeading } from "@/components/page-heading";

interface CustomerFilter extends Omit<PaginationFilter, "status"> {
  gender?: ENUM_USER_GENDER;
  status: ENUM_USER_STATUS | null;
}
const DEFAULT_FILTER: CustomerFilter = {
  search: "",
  gender: ENUM_USER_GENDER.MALE,
  page: 1,
  perPage: 5,
  status: ENUM_USER_STATUS.ACTIVE || null,
};

export default function Customers() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState(DEFAULT_FILTER);
  const debouncedSearch = useDebounce(payload.search, 500);

  const {
    list: { data: customers, total, loading: isLoading },
    updateStatus,
    remove,
  } = useSelector((state: RootState) => state.customers);
  console.log("customers", customers);

  useEffect(() => {
    dispatch(
      customersActions.fetchCustomersRequest({
        search: debouncedSearch,
        page: payload.page,
        perPage: payload.perPage,
        status: payload.status,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    payload.page,
    payload.perPage,
    payload.status,
  ]);
  useEffect(() => {
    if (updateStatus.success || remove.success) {
      dispatch(
        customersActions.fetchCustomersRequest({
          search: debouncedSearch,
          page: payload.page,
          perPage: payload.perPage,
          status: payload.status ?? undefined,
        })
      );
    }
  }, [updateStatus.success, remove.success]);
  useEffect(() => {
    if (updateStatus.error || remove.error) {
      toast.error(updateStatus.error || remove.error);
    }
  }, [updateStatus.error, remove.error]);

  const openEdit = useCallback(
    (record: User) => {
      navigate(`${ROUTER_PATH.CUSTOMERS}/${record._id}?edit=1`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(customersActions.deleteCustomerRequest(id));
      toast.success("Xóa khách hàng thành công!");
    },
    [dispatch]
  );

  return (
    <div className='sm:px-4'>
      <PageHeading title='Danh sách khách hàng' disabledButton />
      <div className='bg-white rounded-lg p-4 border border-gray-200'>
        <div className='mb-4 flex gap-4 max-h-[40px] w-full'>
          {/* <SearchInput onChange={setSearchText} /> */}
          <SelectField
            value={payload.gender ? String(payload.gender) : ""}
            onChange={e =>
              setPayload({
                ...payload,
                gender: e.target.value as ENUM_USER_GENDER,
              })
            }
            options={["Tất cả", "Nam", "Nữ"]}
            optionLabel='Giới tính'
            rootClass='!w-[200px]'
          />
        </div>

        {isLoading ? (
          <SkeletonTable
            columns={[
              { title: "STT", width: 100, height: 50 },
              { title: "Họ tên", width: 100, height: 50 },
              { title: "Email", width: 100, height: 50 },
              { title: "Số điện thoại", width: 100, height: 50 },
              { title: "Giới tính", width: 100, height: 50 },
              { title: "Trạng thái", width: 100, height: 50 },
              { title: "Địa chi", width: 100, height: 50 },
              { title: "Hành động", width: 100, height: 50 },
            ]}
            rows={5}
          />
        ) : (
          <Table
            dataSource={customers}
            columns={columns(openEdit, handleDelete)}
            rowKey='id'
            pagination={{
              current: payload.page,
              pageSize: payload.perPage,
              total,
              onChange: (page, perPage) =>
                setPayload(prev => ({ ...prev, page, perPage })),
              showSizeChanger: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
