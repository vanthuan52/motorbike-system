import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import { ENUM_CARE_RECORD_STATUS, CareRecord } from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch } from "@/store";
import Button from "@/components/ui/button";
import BasicInfoSection from "./basic-info-section";
import { careRecordActions } from "../store/care-record-slice";
import { useCareRecordOptions } from "../hooks/care-record-options";
import CheckListInfoSection from "./check-list-info-section";
import ServiceSummarySection from "./service-summary-section";
import SummarySection from "./summary-section";

type CareRecordFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: CareRecord | null;
};

const CareRecordForm = ({
  initialValues: careRecord,
  mode,
}: CareRecordFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  useEffect(() => {
    if (isCreate) {
      form.resetFields();
    }
  }, [mode, id, form]);
  const { vehicleModelMap, careRecordChecklists, loadingCareRecordChecklists } =
    useCareRecordOptions(id);

  useEffect(() => {
    if (careRecord && isEdit) {
      form.setFieldsValue({
        name: careRecord.appointment?.name || "",
        address: careRecord.appointment?.address || "",
        status: careRecord.status,
        workHours: "",
        vehicleModel:
          typeof careRecord.appointment?.vehicleModel === "string"
            ? vehicleModelMap[careRecord.appointment?.vehicleModel]
            : careRecord.appointment?.vehicleModel?._id,
        licensePlate: careRecord.appointment?.licensePlate || "",
        technician: careRecord.technician?.name || "",
      });
    } else {
      form.resetFields();
    }
  }, [careRecord, form, isEdit]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: CareRecord) => {
    const submitValues = {
      ...values,
      status: values.status as ENUM_CARE_RECORD_STATUS,
    };
    if (isCreate) {
      dispatch(
        careRecordActions.createCareRecord({ careRecord: submitValues })
      );
    } else if (isEdit && id) {
      dispatch(
        careRecordActions.updateCareRecord({
          careRecordId: id,
          careRecord: submitValues,
        })
      );
    }
  };

  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(careRecordActions.deleteCareRecord({ careRecordId: id }));
    }
  };

  const handleStatusChange = (newStatus: ENUM_CARE_RECORD_STATUS) => {
    form.setFieldsValue({
      status: newStatus as ENUM_CARE_RECORD_STATUS,
    });

    if (isEdit && id) {
      dispatch(
        careRecordActions.updateCareRecordStatus({
          careRecordId: id,
          status: newStatus,
        })
      );
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="flex flex-col gap-4">
        <BasicInfoSection mode={mode} onStatusChange={handleStatusChange} />
        <CheckListInfoSection
          careRecordChecklists={careRecordChecklists}
          loadingCareRecordChecklists={loadingCareRecordChecklists}
        />
        <ServiceSummarySection />
        <SummarySection careRecord={careRecord} />
        {(isCreate || isEdit) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="submit"
              variant={"primary"}
              className="w-35 !text-white bg-black hover:bg-gray-700"
              disabled
            >
              {isCreate ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
            {!isCreate && (
              <Button
                className="w-20 !text-white"
                variant={"destructive"}
                type="reset"
                onClick={handleDelete}
                disabled
              >
                Xóa
              </Button>
            )}

            <Button
              className="w-20 !text-red-600"
              variant={"outline-destructive"}
              type="reset"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
};

export default CareRecordForm;
