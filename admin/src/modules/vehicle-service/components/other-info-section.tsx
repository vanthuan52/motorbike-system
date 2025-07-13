import { useEffect } from "react";
import { Card, Checkbox, Form, Input } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useAppDispatch, useAppSelector } from "@/store";
import { SERVICE_CHECKLIST_AREA_LABEL_MAP } from "@/modules/service-checklist/constants/service-checklist.constant";
import { serviceChecklistActions } from "@/modules/service-checklist/store/service-checklist-slice";

type OtherInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
};
const OtherInfoSection = ({ mode }: OtherInfoSectionProps) => {
  const dispatch = useAppDispatch();
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;
  const checklistItems = useAppSelector((state) => state.serviceChecklist.list);

  useEffect(() => {
    dispatch(
      serviceChecklistActions.getServiceChecklistList({ page: 1, perPage: 100 })
    );
  }, []);

  const checklistOptions = checklistItems.map((item) => ({
    label: `${item.name} (${SERVICE_CHECKLIST_AREA_LABEL_MAP[item.area]})`,
    value: item._id,
  }));

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin khác</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item label="Mô tả" name="description" className="md:col-span-2">
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Danh sách công việc"
            name="checklistItems"
            className="md:col-span-2"
          >
            <Checkbox.Group>
              <div className="grid grid-cols-1 gap-x-8 gap-y-2">
                {checklistOptions.map((item) => (
                  <Checkbox
                    key={item.value}
                    value={item.value}
                    disabled={isDisabled}
                  >
                    {item.label}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default OtherInfoSection;
