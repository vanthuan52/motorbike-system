import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ColumnsType } from "antd/es/table";
import { Button, Tooltip } from "antd";
import dayjs from "dayjs";
import { EyeOutlined } from "@ant-design/icons";
import { Candidate, ENUM_CANDIDATE_STATUS } from "../types";
import CandidateStatusTag from "../components/CandidateStatusTag";
import { ROUTER_PATH } from "@/constants/router-path";
import { useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "@/store";
import { hiringActions } from "@/modules/hiring/store/hiring-slice";
import { Hiring } from "@/modules/hiring/types";

interface UseCandidateTableColumnsProps {
  currentPage: number;
  pageSize: number;
  hiringId: Hiring["_id"];
}

export const useCandidateTableColumns = ({
  currentPage,
  pageSize,
  hiringId,
}: UseCandidateTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hiringDetail } = useSelector((state: RootState) => state.hiring);
  useEffect(() => {
    if (hiringId) {
      dispatch(hiringActions.getHiringDetail({ hiringId }));
    }
  }, [dispatch, hiringId]);

  const columns: ColumnsType<Candidate> = useMemo(() => {
    return [
      {
        title: "STT",
        dataIndex: "id",
        key: "id",
        render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: "Tên bài tuyển dụng",
        dataIndex: "hiringId",
        key: "hiringId",
        render: () => hiringDetail?.title || "—",
      },
      {
        title: "Họ tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Ngày ứng tuyển",
        dataIndex: "appliedAt",
        key: "appliedAt",
        render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ENUM_CANDIDATE_STATUS) => (
          <CandidateStatusTag status={status} />
        ),
      },
      {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Xem chi tiết">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.CANDIDATE_DETAILS.replace(
                      ":id",
                      record._id
                    )}?edit=1`
                  )
                }
              />
            </Tooltip>
          </div>
        ),
      },
    ];
  }, [currentPage, pageSize, navigate, hiringDetail?.title]);

  return { columns };
};
