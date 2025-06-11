import React, { useEffect } from "react";
import { Button, Form, InputNumber } from "antd";
import { parts } from "./parts";
import PartInputWithToggleNote from "./PartInputWithNote";

type PartValues = { [key: string]: number };
type PartNotes = { [key: string]: string };

type Props = {
  initialValues?: PartValues;
  initialNotes?: PartNotes;
  disabled?: boolean;
  showActions?: boolean;
  onSubmit?: (values: PartValues, notes: PartNotes) => void;
  showBefore?: boolean;
  showAfter?: boolean;
  loadingButton?: boolean;
};

export default function PartsFormTab({
  initialValues = {},
  initialNotes = {},
  disabled = false,
  showActions = false,
  onSubmit,
  showBefore = false,
  showAfter = false,
  loadingButton = false,
}: Props) {
  const [form] = Form.useForm();

  const calcAverage = (vals: any) => {
    const nums = parts
      .map((part) => Number(vals?.[part.key]))
      .filter((v) => !isNaN(v));
    if (!nums.length) return 0;
    return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
  };
  useEffect(() => {
    if (showBefore || showAfter) {
      const avg = calcAverage(initialValues);
      form.setFieldsValue({ percentage_before_maintenance: avg });
    }
  }, [form, initialValues, showBefore, showAfter]);
  const handleValuesChange = (_: any, allValues: any) => {
    if (showBefore || showAfter) {
      const avg = calcAverage(allValues);
      form.setFieldsValue({ percentage_before_maintenance: avg });
    }
    if (showAfter) {
      const avgAfter = calcAverage(allValues);
      form.setFieldsValue({ percentage_after_maintenance: avgAfter });
    }
  };

  const handleSave = () => {
    const allValues = form.getFieldsValue();
    const values: PartValues = {};
    const notes: PartNotes = {};
    Object.keys(allValues).forEach((key) => {
      if (key.endsWith("_note")) {
        notes[key.replace("_note", "")] = allValues[key];
      } else {
        values[key] = allValues[key];
      }
    });
    if (onSubmit) onSubmit(values, notes);
  };

  const mergedInitial = {
    ...initialValues,
    ...Object.fromEntries(
      Object.entries(initialNotes).map(([k, v]) => [`${k}_note`, v])
    ),
  };

  return (
    <Form
      layout="horizontal"
      form={form}
      initialValues={mergedInitial}
      onValuesChange={handleValuesChange}
    >
      <div className="h-80 overflow-y-auto w-full">
        {parts.map((part) => (
          <PartInputWithToggleNote
            key={part.key}
            label={part.label}
            name={part.name}
            disabled={disabled}
          />
        ))}
      </div>
      {showActions && (
        <Form.Item>
          <div className="flex gap-4 justify-center mt-4">
            <Button className="!text-lg">Ghi âm</Button>
            <Button className="!text-lg">Quay video</Button>
            <Button
              onClick={handleSave}
              className="!text-lg"
              loading={loadingButton}
            >
              Lưu
            </Button>
          </div>
        </Form.Item>
      )}
      <div className="flex justify-between items-center">
        {(showBefore || showAfter) && (
          <Form.Item
            label={
              <div className="text-left text-lg">
                Trung bình trước bảo dưỡng
              </div>
            }
            name="percentage_before_maintenance"
            style={{ marginTop: 16 }}
            colon={false}
          >
            <InputNumber
              value={form.getFieldValue("percentage_before_maintenance") || ""}
              disabled
              addonAfter="%"
              style={{ width: 120 }}
              size="large"
            />
          </Form.Item>
        )}
        {showAfter && (
          <Form.Item
            label={
              <div className="text-left text-lg">Trung bình sau bảo dưỡng</div>
            }
            name="percentage_after_maintenance"
            style={{ marginTop: 8 }}
            colon={false}
          >
            <InputNumber
              value={form.getFieldValue("percentage_after_maintenance") || ""}
              disabled
              addonAfter="%"
              style={{ width: 120 }}
              size="large"
            />
          </Form.Item>
        )}
      </div>
      <div className="flex justify-end">
        <Button className="!text-lg">Hoàn thành</Button>
      </div>
    </Form>
  );
}
