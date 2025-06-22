import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Hiring, HiringStatusEnum } from "../types";
import { Button, Col, Input, Row, Select } from "antd";
import { PageHeading } from "@/components/page-heading";
import { ROUTER_PATH } from "@/constants/router-path";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationFilter } from "@/interfaces/pagination-filter.interface";
import { RootState } from "@/store";
import { hiringActions } from "../store/hiring-slice";
import { STATUS_HIRING_OPTIONS } from "../constants/status";
import SkeletonTable from "@/components/ui/SkeletonTable";
import Table from "@/components/ui/table/table";
import { getHiringColumns } from "../components/hiring-columns";

interface HiringFilter extends PaginationFilter {}
const DEFAULT_FILTER: HiringFilter = {
  search: "",
  page: 1,
  perPage: 5,
  status: null,
};
export default function hiring() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState(DEFAULT_FILTER);
  const debouncedSearch = useDebounce(payload.search, 500);

  const {
    list: { data: hiring, total, loading: isLoading },
    updateStatus,
    remove,
  } = useSelector((state: RootState) => state.hiring);
  useEffect(() => {
    dispatch(
      hiringActions.fetchHiringRequest({
        search: debouncedSearch,
        page: payload.page,
        perPage: payload.perPage,
        status: payload.status ?? undefined,
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
        hiringActions.fetchHiringRequest({
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
  const openCreate = useCallback(
    () => navigate(ROUTER_PATH.CREATE_HIRING),
    [navigate]
  );
  const openEdit = useCallback(
    (record: Hiring) => navigate(`${ROUTER_PATH.HIRING}/${record._id}`),
    [navigate]
  );
  const handleDelete = useCallback(
    (id: string) => dispatch(hiringActions.deleteHiringRequest({ id })),
    [dispatch]
  );
  const handleChangeStatus = (newStatus: HiringStatusEnum, record: Hiring) => {
    dispatch(
      hiringActions.updateStatusHiringRequest({
        id: record._id,
        status: newStatus,
      })
    );
  };

  const handleResetFilter = useCallback(() => setPayload(DEFAULT_FILTER), []);
  const columns = useMemo(
    () =>
      getHiringColumns({
        openEdit,
        handleDelete,
        handleChangeStatus,
        updateStatusLoading: updateStatus.loading,
      }),
    [openEdit, handleDelete, handleChangeStatus, updateStatus.loading]
  );
  const filterControls = (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col>
        <Input
          placeholder="Tìm theo tiêu đề"
          value={payload.search}
          onChange={(e) =>
            setPayload((prev) => ({ ...prev, search: e.target.value, page: 1 }))
          }
          allowClear
          style={{ width: 200, height: 40 }}
        />
      </Col>
      <Col>
        <Select
          placeholder="Trạng thái"
          value={payload.status}
          onChange={(value) =>
            setPayload((prev) => ({
              ...prev,
              status: value,
              page: 1,
            }))
          }
          allowClear
          style={{ width: 120, height: 40 }}
          options={STATUS_HIRING_OPTIONS}
        />
      </Col>
      <Col>
        <Button onClick={handleResetFilter} style={{ height: 40 }}>
          Đặt lại
        </Button>
      </Col>
    </Row>
  );
  const tableContent = isLoading ? (
    <SkeletonTable
      columns={[
        { title: "ID", width: 150, height: 55 },
        { title: "TIÊU ĐỀ", width: 215, height: 55 },
        { title: "MÔ TẢ", width: 400, height: 55 },
        { title: "TRẠNG THÁI", width: 195, height: 55 },
        { title: "HÀNH ĐỘNG", width: 100, height: 55 },
      ]}
      rows={5}
    />
  ) : (
    <Table
      dataSource={hiring}
      columns={columns}
      rowKey="_id"
      pagination={{
        current: payload.page,
        pageSize: payload.perPage,
        total,
        onChange: (page, perPage) =>
          setPayload((prev) => ({ ...prev, page, perPage })),
        showSizeChanger: true,
      }}
    />
  );
  return (
    <div className="sm:px-4 pt-8 sm:pt-0">
      <div style={{ marginBottom: 16 }}>
        <PageHeading
          title="Tuyển dụng"
          onClick={openCreate}
          addButtonLabel="Thêm danh mục"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 px-5 pt-4">{filterControls}</div>

        {tableContent}
      </div>
    </div>
  );
}
