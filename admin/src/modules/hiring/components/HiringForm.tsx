import { Form } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import slugify from "slugify";
import Button from "@/components/ui/button";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { RootState, useAppDispatch } from "@/store";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { hiringActions } from "../store/hiring-slice";
import BasicInfoSection from "./basic-info-section";
import RecruitmentRequirementSection from "./recruitment-requirement-section";
import OtherInfoSection from "./other-info-section";
import { ENUM_HIRING_STATUS } from "../types";
import { ROUTER_PATH } from "@/constants/router-path";

type HiringFormProps = {
  mode: ENUM_PAGE_MODE;
};
export default function HiringForm({ mode }: HiringFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();

  const { loading, hiringDetail, error } = useSelector(
    (state: RootState) => state.hiring
  );
  const isFormFilledRef = useRef(false);

  useEffect(() => {
    if (
      hiringDetail &&
      (mode === ENUM_PAGE_MODE.EDIT || mode === ENUM_PAGE_MODE.VIEW) &&
      !isFormFilledRef.current
    ) {
      form.setFieldsValue({
        ...hiringDetail,
        applicationDeadline: hiringDetail.applicationDeadline
          ? dayjs(hiringDetail.applicationDeadline)
          : undefined,
      });
    }
  }, [hiringDetail, form]);
  useEffect(() => {
    if (mode === ENUM_PAGE_MODE.CREATE) {
      form.resetFields();
      isFormFilledRef.current = false;
    }
  }, [mode, id, form]);

  useEffect(() => {
    if (error) {
      notificationActions.notify({
        type: "error",
        message: "Lỗi",
      });
    }
  }, [error]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleValuesChange = (changed: Record<string, unknown>) => {
    if ("title" in changed) {
      form.setFieldsValue({ slug: slugify(changed.title as string) });
    }
  };

  const handleDelete = () => {
    if (mode === ENUM_PAGE_MODE.EDIT && id) {
      dispatch(hiringActions.deleteHiring({ hiringId: id }));
    }
  };
  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (
      values.applicationDeadline &&
      values.applicationDeadline.isValid &&
      values.applicationDeadline.isValid()
    ) {
      values.applicationDeadline =
        values.applicationDeadline.format("YYYY-MM-DD");
    } else {
      values.applicationDeadline = null;
    }
    if (mode === ENUM_PAGE_MODE.CREATE) {
      dispatch(hiringActions.createHiring({ hiring: values }));
    } else if (mode === ENUM_PAGE_MODE.EDIT && id) {
      dispatch(hiringActions.updateHiring({ hiringId: id, hiring: values }));
    }
  };

  const handleStatusChange = (newStatus: ENUM_HIRING_STATUS) => {
    form.setFieldsValue({ status: newStatus });

    if (mode === ENUM_PAGE_MODE.EDIT && id) {
      dispatch(
        hiringActions.updateHiringStatus({
          hiringId: id,
          status: newStatus,
        })
      );
    }
  };
  const handleFinishDraft = async () => {
    const values = await form.validateFields();
    if (
      values.applicationDeadline &&
      values.applicationDeadline.isValid &&
      values.applicationDeadline.isValid()
    ) {
      values.applicationDeadline =
        values.applicationDeadline.format("YYYY-MM-DD");
    } else {
      values.applicationDeadline = null;
    }
    dispatch(hiringActions.createHiring({ hiring: values }));
  };
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={handleValuesChange}
    >
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => navigate(`${ROUTER_PATH.CANDIDATE}?hiring=${id}`)}
          variant={"primary"}
          className="w-45 !text-white bg-black hover:bg-gray-700"
        >
          Danh sách ứng viên
        </Button>
        <BasicInfoSection mode={mode} />

        <RecruitmentRequirementSection mode={mode} />

        <OtherInfoSection mode={mode} handleStatusChange={handleStatusChange} />
        {(mode === ENUM_PAGE_MODE.CREATE || mode === ENUM_PAGE_MODE.EDIT) && (
          <div className="flex justify-end gap-2 w-full mt-4">
            <Button
              type="submit"
              onClick={handleSubmit}
              variant={"primary"}
              className="w-35 !text-white bg-black hover:bg-gray-700"
              loading={loading}
            >
              {mode === ENUM_PAGE_MODE.CREATE ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
            {mode !== ENUM_PAGE_MODE.CREATE && (
              <Button
                className="w-20 !text-white"
                variant={"destructive"}
                type="reset"
                disabled={loading}
                onClick={handleDelete}
              >
                Xóa
              </Button>
            )}
            {mode === ENUM_PAGE_MODE.CREATE && (
              <Button
                type="submit"
                onClick={handleFinishDraft}
                loading={loading}
                className="!text-white"
              >
                Lưu nháp
              </Button>
            )}
            <Button
              className="w-20 !text-red-600"
              variant={"outline-destructive"}
              type="reset"
              disabled={loading}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
}
