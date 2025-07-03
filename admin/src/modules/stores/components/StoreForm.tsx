import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import slugify from "slugify";
import { Form } from "antd";
import { ENUM_STORE_STATUS, Store } from "../types";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch } from "@/store";
import { storeActions } from "../store/stores-slice";
import Button from "@/components/ui/button";
import BasicInfoSection from "./basic-info-section";
import OtherInfoSection from "./other-info-section";

type StoreFormProps = {
  mode: ENUM_PAGE_MODE;
  initialValues?: Store | null;
};

const StoreForm = ({ initialValues: store, mode }: StoreFormProps) => {
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

  useEffect(() => {
    if (store && isEdit) {
      form.setFieldsValue({
        ...store,
        status: store.status === ENUM_STORE_STATUS.ACTIVE,
      });
    } else {
      form.resetFields();
    }
  }, [store, form, isEdit]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleValuesChange = (changed: Record<string, unknown>) => {
    if ("name" in changed) {
      form.setFieldsValue({ slug: slugify(changed.name as string) });
    }
  };

  const handleSubmit = async (values: Store) => {
    const submitValues = {
      ...values,
      status: values.status
        ? ENUM_STORE_STATUS.ACTIVE
        : ENUM_STORE_STATUS.INACTIVE,
    };
    if (isCreate) {
      dispatch(storeActions.createStore({ store: submitValues }));
    } else if (isEdit && id) {
      dispatch(
        storeActions.updateStore({
          storeId: id,
          store: submitValues,
        })
      );
    }
  };

  const handleDelete = () => {
    if (isEdit && id) {
      dispatch(storeActions.deleteStore({ storeId: id }));
    }
  };

  const handleStatusChange = (newStatus: ENUM_STORE_STATUS) => {
    form.setFieldsValue({
      status: newStatus === ENUM_STORE_STATUS.ACTIVE,
    });

    if (isEdit && id) {
      dispatch(
        storeActions.updateStoreStatus({
          storeId: id,
          status: newStatus,
        })
      );
    }
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSubmit}
      onValuesChange={handleValuesChange}
    >
      <div className='flex flex-col gap-4'>
        <BasicInfoSection mode={mode} onStatusChange={handleStatusChange} />
        <OtherInfoSection mode={mode} />

        {(isCreate || isEdit) && (
          <div className='flex justify-end gap-4 mt-6'>
            <Button
              type='submit'
              variant={"primary"}
              className='w-35 !text-white bg-black hover:bg-gray-700'
            >
              {isCreate ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
            {!isCreate && (
              <Button
                className='w-20 !text-white'
                variant={"destructive"}
                type='reset'
                onClick={handleDelete}
              >
                Xóa
              </Button>
            )}

            <Button
              className='w-20 !text-red-600'
              variant={"outline-destructive"}
              type='reset'
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

export default StoreForm;
