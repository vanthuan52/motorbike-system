import { ENUM_PAGE_MODE } from "@/types/app.type";
import { Candidate, CandidateReview, ENUM_CANDIDATE_STATUS } from "../types";
import { useAppDispatch } from "@/store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Form } from "antd";
import { candidateActions } from "../store/candidate-slice";
import { User } from "@/modules/user/types";
import BasicInfoSection from "./basic-info-section";
import dayjs from "dayjs";
import ApplyInfoSection from "./apply-info-section";
import CandidateReviewsSection from "./candidate-reviews-section";
import Button from "@/components/ui/button";
import { Hiring } from "@/modules/hiring/types";

type CandidateFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValue?: Candidate | null;
  candidateReviews: CandidateReview[];
  loadingCandidateReviews: boolean;
  setMore: (more: number) => void;
  user: User | null;
  paginationState?: { page: number; perPage: number; total?: number };
  hiringDetail?: Hiring | null;
  createCandidateReview?: {
    loading: boolean;
    success: boolean;
  };
};
export default function CandidateForm({
  mode,
  initialValue: candidate,
  candidateReviews,
  loadingCandidateReviews,
  setMore,
  user,
  paginationState,
  hiringDetail,
  createCandidateReview,
}: CandidateFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  useEffect(() => {
    if (candidate && isEdit) {
      form.setFieldsValue({
        ...candidate,
        appliedAt: candidate.appliedAt ? dayjs(candidate.appliedAt) : undefined,
      });
    }
  }, [candidate, isEdit]);
  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (values: CandidateReview) => {
    if (!id || !user?._id || !values.feedback?.trim()) return;
    const submitValues = {
      user: user._id,
      candidate: id,
      feedback: values.feedback,
    };

    if (isEdit && id) {
      dispatch(
        candidateActions.createCandidateReview({
          candidateReview: submitValues,
        })
      );
    }
  };
  useEffect(() => {
    if (createCandidateReview?.success) {
      form.setFieldsValue({ feedback: "" });
      dispatch(candidateActions.resetCreateCandidateReview());
    }
  }, [createCandidateReview?.success]);

  const handleStatusChange = (newStatus: ENUM_CANDIDATE_STATUS) => {
    form.setFieldsValue({ status: newStatus });

    if (isEdit && id) {
      dispatch(
        candidateActions.updateCandidateStatus({
          candidateId: id,
          status: newStatus,
        })
      );
    }
  };

  const handleDownloadCV = () => {};
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} className="">
      <div className="flex flex-col gap-4">
        <BasicInfoSection
          onStatusChange={handleStatusChange}
          hiringDetail={hiringDetail}
        />
        <ApplyInfoSection candidate={candidate} />
        <CandidateReviewsSection
          candidateReviews={candidateReviews}
          loadingCandidateReviews={loadingCandidateReviews}
          setMore={setMore}
          paginationState={paginationState}
        />
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="submit"
            variant={"primary"}
            className="w-35 !text-white bg-black hover:bg-gray-700"
            loading={createCandidateReview?.loading}
          >
            Gửi Đánh giá
          </Button>
          <Button
            className="w-40 !text-white"
            variant={"primary"}
            onClick={() => handleStatusChange(ENUM_CANDIDATE_STATUS.REVIEWED)}
          >
            Đánh dấu đã xem
          </Button>
          <Button
            className="w-40 !text-white"
            variant={"primary"}
            onClick={handleDownloadCV}
          >
            Tải CV
          </Button>
          <Button
            className="w-20 !text-red-600"
            variant={"outline-destructive"}
            type="reset"
            onClick={handleCancel}
          >
            Hủy
          </Button>
        </div>
      </div>
    </Form>
  );
}
