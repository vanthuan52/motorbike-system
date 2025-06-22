import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/ui/table/table";
import SelectField from "@/components/ui/select-field";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { RootState } from "@/store";
import { customerActions } from "../store/customer-slice";
import { ENUM_USER_GENDER, ENUM_USER_STATUS, User } from "@/modules/user/types";
import { columns } from "../components/customer-column";
import { PageHeading } from "@/components/page-heading";
import { UserPaginationQuery } from "@/modules/user/types";
import { ROUTER_PATH } from "@/constants/router-path";
import { useDebounce } from "@/hooks/useDebounce";

const USER_DEFAULT_QUERY: UserPaginationQuery = {
  search: "",
  page: 1,
  perPage: 5,
  status: ENUM_USER_STATUS.ACTIVE || undefined,
};

export default function Customers() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState(USER_DEFAULT_QUERY);
  const debouncedSearch = useDebounce(payload.search, 500);

  const {
    users: customers,
    loading,
    pagination,
  } = useSelector((state: RootState) => state.customer);

  useEffect(() => {
    dispatch(
      customerActions.getCustomers({
        search: debouncedSearch,
        page: payload.page,
        perPage: payload.perPage,
        status: payload.status,
      } as UserPaginationQuery)
    );
  }, [
    dispatch,
    debouncedSearch,
    payload.page,
    payload.perPage,
    payload.status,
  ]);

  const handleCreate = () => {
    navigate(`${ROUTER_PATH.CUSTOMERS_CREATION}`);
  };

  const openEdit = useCallback(
    (user: User) => {
      navigate(
        `${ROUTER_PATH.CUSTOMERS_DETAIL.replace(":id", user._id)}?edit=1`
      );
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(customerActions.deleteCustomer({ customerId: id }));
    },
    [dispatch]
  );

  return (
    <div className="sm:px-4 pt-8 sm:pt-0">
      <div style={{ marginBottom: 16 }}>
        <PageHeading title="Danh sách khách hàng" onClick={handleCreate} />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 px-5 pt-4 flex gap-4 max-h-[55px] w-full">
          {/* <SearchInput onChange={setSearchText} /> */}
          <SelectField
            value={payload.gender ? String(payload.gender) : ""}
            onChange={(e) =>
              setPayload({
                ...payload,
                gender: e.target.value as ENUM_USER_GENDER,
              })
            }
            options={["Tất cả", "Nam", "Nữ"]}
            optionLabel="Giới tính"
            rootClass="!w-[200px]"
          />
        </div>

        {loading ? (
          <SkeletonTable
            columns={[
              { title: "STT", width: 100, height: 50 },
              { title: "HỌ TÊN", width: 100, height: 50 },
              { title: "EMAIL", width: 100, height: 50 },
              { title: "SỐ ĐIỆN THOẠI", width: 100, height: 50 },
              { title: "GIỚI TÍNH", width: 100, height: 50 },
              { title: "TRẠNG THÁI", width: 100, height: 50 },
              { title: "ĐỊA CHỈ", width: 100, height: 50 },
              { title: "HÀNH ĐỘNG", width: 100, height: 50 },
            ]}
            rows={5}
          />
        ) : (
          <Table
            dataSource={customers}
            columns={columns(openEdit, handleDelete)}
            rowKey="id"
            pagination={{
              current: pagination?.page,
              pageSize: pagination?.perPage,
              total: pagination?.total,
              onChange: (page, perPage) =>
                setPayload((prev) => ({ ...prev, page, perPage })),
              showSizeChanger: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
