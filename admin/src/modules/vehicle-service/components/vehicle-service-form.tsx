import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import { ENUM_VEHICLE_SERVICE_STATUS, VehicleService } from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch, useAppSelector } from "@/store";
import { vehicleServiceActions } from "../store/vehicle-service-slice";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import Button from "@/components/ui/button";
import PhotoUploadSection from "./photo-section";
import StatusSection from "./status-section";
import { SelectOptionItem } from "@/components/ui/ant-design/select-option";
import { serviceCategoryActions } from "@/modules/service-category/store/service-category-slice";

type VehicleServiceFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: VehicleService | null;
};
const VehicleServiceForm = ({
  mode,
  initialValues: vehicleService,
}: VehicleServiceFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  // Start get service categories
  const { list: serviceCategories, loadingList: loadingServiceCategories } =
    useAppSelector((state) => state.serviceCategory);

  const serviceCategoryOptions: SelectOptionItem[] = useMemo(() => {
    return serviceCategories.map((category) => ({
      value: category._id,
      label: category.name,
    }));
  }, [serviceCategories]);

  useEffect(() => {
    if (!serviceCategories || serviceCategories.length === 0) {
      dispatch(
        serviceCategoryActions.getServiceCategories({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch, serviceCategories]);
  // end get service categories

  useEffect(() => {
    if (isCreate) {
      form.resetFields();
      setFileList([]);
    }
  }, [mode, id, form]);

  useEffect(() => {
    if (vehicleService && isEdit) {
      form.setFieldsValue({
        ...vehicleService,
        serviceCategory: vehicleService.serviceCategory._id,
      });
      if (vehicleService.photo) {
        setFileList([
          {
            uid: "-1",
            name: "vehicle-service-photo.png",
            status: "done",
            url: vehicleService.photo,
          } as any,
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [vehicleService, form, mode]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: VehicleService) => {
    const submitValues = {
      ...values,
      photo:
        fileList.length > 0
          ? fileList[0].originFileObj || fileList[0].url || undefined
          : undefined,
    };
    if (isCreate) {
      dispatch(
        vehicleServiceActions.createVehicleService({
          vehicleService: submitValues,
        })
      );
    } else if (isEdit && id) {
      dispatch(
        vehicleServiceActions.updateVehicleService({
          vehicleServiceId: id,
          vehicleService: submitValues,
        })
      );
    }
  };
  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(
        vehicleServiceActions.deleteVehicleService({ vehicleServiceId: id })
      );
    }
  };
  const handleStatusChange = (newStatus: ENUM_VEHICLE_SERVICE_STATUS) => {
    form.setFieldsValue({
      status: newStatus,
    });

    if (isEdit && id) {
      dispatch(
        vehicleServiceActions.updateVehicleServiceStatus({
          vehicleServiceId: id,
          status: newStatus,
        })
      );
    }
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <BasicInfoSection
            mode={mode}
            serviceCategoryOptions={serviceCategoryOptions}
            loadingServiceCategories={loadingServiceCategories}
          />
          <OtherInfoSection mode={mode} />
        </div>
        <div className="flex flex-col gap-6">
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
          <StatusSection mode={mode} onStatusChange={handleStatusChange} />
        </div>
      </div>

      {(isCreate || isEdit) && (
        <div className="flex justify-start gap-4 mt-6">
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
    </Form>
  );
};

export default VehicleServiceForm;
