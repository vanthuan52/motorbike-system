import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
  VehicleModel,
} from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch, useAppSelector } from "@/store";
import { vehicleModelActions } from "../store/vehicle-model-slice";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";
import Button from "@/components/ui/button";
import PhotoUploadSection from "./photo-section";
import StatusSection from "./status-section";
import { SelectOptionItem } from "@/components/ui/ant-design/select-option";
import { vehicleBrandActions } from "@/modules/vehicle-brand/store/vehicle-brand-slice";
import VehicleTypeSection from "./vehicle-type-section";
import VehicleFuelTypeSection from "./vehicle-fuel-type-section";

type VehicleModelFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: VehicleModel | null;
};
const VehicleModelForm = ({
  mode,
  initialValues: vehicleModel,
}: VehicleModelFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const isEdit = mode === ENUM_PAGE_MODE.EDIT;
  const isCreate = mode === ENUM_PAGE_MODE.CREATE;

  // Start get vehicle brands
  const { list: vehicleBrands, loadingList: loadingVehicleBrands } =
    useAppSelector((state) => state.vehicleBrand);

  const vehicleBrandOptions: SelectOptionItem[] = useMemo(() => {
    return vehicleBrands.map((brand) => ({
      value: brand._id,
      label: brand.name,
    }));
  }, [vehicleBrands]);

  useEffect(() => {
    if (!vehicleBrands || vehicleBrands.length === 0) {
      dispatch(
        vehicleBrandActions.getVehicleBrands({ page: 1, perPage: 1000 })
      );
    }
  }, [dispatch, vehicleBrands]);
  // end get vehicle brands

  useEffect(() => {
    form.resetFields();
    setFileList([]);

    if (isEdit && vehicleModel) {
      form.setFieldsValue({
        ...vehicleModel,
        vehicleBrand: vehicleModel.vehicleBrand._id,
      });
      if (vehicleModel.photo) {
        setFileList([
          {
            uid: "-1",
            name: "vehicle-model-photo.png",
            status: "done",
            url: vehicleModel.photo,
          } as any,
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [mode, id, form, isEdit, vehicleModel]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: VehicleModel) => {
    const submitValues = {
      ...values,
      yearStart: values.yearStart ? Number(values.yearStart) : undefined,
      yearEnd: values.yearEnd ? Number(values.yearEnd) : undefined,
      photo:
        fileList.length > 0
          ? fileList[0].originFileObj || fileList[0].url || undefined
          : undefined,
    };
    if (isCreate) {
      dispatch(
        vehicleModelActions.createVehicleModel({
          vehicleModel: submitValues,
        })
      );
    } else if (isEdit && id) {
      dispatch(
        vehicleModelActions.updateVehicleModel({
          vehicleModelId: id,
          vehicleModel: submitValues,
        })
      );
    }
  };
  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(vehicleModelActions.deleteVehicleModel({ vehicleModelId: id }));
    }
  };
  const handleStatusChange = (newStatus: ENUM_VEHICLE_MODEL_STATUS) => {
    form.setFieldsValue({
      status: newStatus,
    });

    if (isEdit && id) {
      dispatch(
        vehicleModelActions.updateVehicleModelStatus({
          vehicleModelId: id,
          status: newStatus,
        })
      );
    }
  };

  const handleVehicleTypeChange = (newType: ENUM_VEHICLE_MODEL_TYPE) => {
    form.setFieldsValue({
      type: newType,
    });
  };

  const handleVehicleFuelTypeChange = (
    newFuelType: ENUM_VEHICLE_MODEL_FUEL_TYPE
  ) => {
    form.setFieldsValue({
      fuelType: newFuelType,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <BasicInfoSection
            mode={mode}
            vehicleBrandOptions={vehicleBrandOptions}
            loadingVehicleBrands={loadingVehicleBrands}
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
          <VehicleTypeSection
            mode={mode}
            onTypeChange={handleVehicleTypeChange}
          />
          <VehicleFuelTypeSection
            mode={mode}
            onFuelTypeChange={handleVehicleFuelTypeChange}
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

export default VehicleModelForm;
