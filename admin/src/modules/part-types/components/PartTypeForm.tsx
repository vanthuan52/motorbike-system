import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import slugify from "slugify";
import { Form } from "antd";
import { ENUM_PART_TYPE_STATUS, PartType } from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch } from "@/store";
import { partTypeActions } from "../store/part-types-slice";
import BasicInfoSection from "./basic-info-section";
import PhotoUploadSection from "./photo-section";
import OtherInfoSection from "./other-info-section";
import Button from "@/components/ui/button";

type PartTypeFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: PartType | null;
};
const PartTypeForm = ({ initialValues: partType, mode }: PartTypeFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  useEffect(() => {
    if (isCreate) {
      form.resetFields();
      setFileList([]);
    }
  }, [mode, id, form]);

  useEffect(() => {
    if (partType && isEdit) {
      form.setFieldsValue({
        ...partType,
        status: partType.status === ENUM_PART_TYPE_STATUS.ACTIVE,
      });
      if (partType.photo && Array.isArray(partType.photo)) {
        setFileList(
          partType.photo.map((img, idx) => ({
            uid: String(-idx - 1),
            name: `photo-${idx}.jpg`,
            status: "done",
            url: img.startsWith("/") ? img : "/" + img,
          }))
        );
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [partType, form, setFileList]);
  const handleCancel = () => {
    navigate(-1);
  };
  const handleValuesChange = (changed: Record<string, unknown>) => {
    if ("name" in changed) {
      form.setFieldsValue({ slug: slugify(changed.name as string) });
    }
  };

  const handleSubmit = async (values: PartType) => {
    const submitValues = {
      ...values,
      status: values.status
        ? ENUM_PART_TYPE_STATUS.ACTIVE
        : ENUM_PART_TYPE_STATUS.INACTIVE,
      photo:
        fileList.length > 0
          ? fileList[0].originFileObj || fileList[0].url || undefined
          : undefined,
    };
    if (isCreate) {
      dispatch(partTypeActions.createPartType({ partType: submitValues }));
    } else if (isEdit && id) {
      dispatch(
        partTypeActions.updatePartType({
          partTypeId: id,
          partType: submitValues,
        })
      );
    }
  };
  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(partTypeActions.deletePartType({ partTypeId: id }));
    }
  };
  const handleStatusChange = (newStatus: ENUM_PART_TYPE_STATUS) => {
    form.setFieldsValue({
      status: newStatus === ENUM_PART_TYPE_STATUS.ACTIVE,
    });

    if (isEdit && id) {
      dispatch(
        partTypeActions.updatePartTypeStatus({
          partTypeId: id,
          status: newStatus,
        })
      );
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      onValuesChange={handleValuesChange}
    >
      <div className="flex flex-col gap-4">
        <BasicInfoSection mode={mode} onStatusChange={handleStatusChange} />
        <PhotoUploadSection
          mode={mode}
          fileList={fileList}
          onUpload={(file) => {
            setFileList([file]);
            form.setFieldsValue({ photo: file });
          }}
          onRemove={() => {
            setFileList([]);
            form.setFieldsValue({ photo: undefined });
          }}
        />
        <OtherInfoSection mode={mode} />

        {(isCreate || isEdit) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="submit"
              variant={"primary"}
              className="w-35 !text-white bg-black hover:bg-gray-700"
            >
              {isCreate ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
            {!isCreate && (
              <Button
                className="w-20 !text-white"
                variant={"destructive"}
                type="reset"
                onClick={handleDelete}
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

export default PartTypeForm;
