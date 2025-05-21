/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import dayjs from "dayjs";

import PartsFormTab from "./PartsFormTab";
import { buildMaintenanceHistory } from "./buildMaintenanceHistory";
import { parts } from "./parts";
import { MaintenanceHistory } from "@/types/technician/MaintenanceHistory";
import { maintenanceHistories } from "@/data/technician/MaintenanceHistory";
import { toast } from "react-toastify";

interface TabsProps {
  tabKey: string;
  vehicleID?: string;
}

function getNearestHistory(histories: MaintenanceHistory[]) {
  const today = dayjs();
  return histories.reduce((nearest, curr) => {
    const currDiff = Math.abs(today.diff(dayjs(curr.date)));
    const nearestDiff = nearest ? Math.abs(today.diff(dayjs(nearest.date))) : Infinity;
    return currDiff < nearestDiff ? curr : nearest;
  }, undefined as MaintenanceHistory | undefined);
}

export default function Tabs({ tabKey, vehicleID }: TabsProps) {
  const histories = maintenanceHistories.filter((history) => history.vehicle_id === vehicleID);
  const nearest = getNearestHistory(histories);
  const [loadingButton, setLoadingButton] = useState(false);
  const handleSubmit = (values: any, notes: any, type: string) => {
    setLoadingButton(true);
    const newHistory = buildMaintenanceHistory({
      values,
      notes,
      vehicleID: vehicleID || "",
      customerID: "cus-xx",
      id: Date.now(),
      date: dayjs().format("YYYY-MM-DD"),
      percentage_before_maintenance: values.percentage_before_maintenance,
      percentage_after_maintenance: values.percentage_after_maintenance,
    });
    console.log(`Dữ liệu lưu (${type === "before" ? "Trước bảo dưỡng" : "Sau bảo dưỡng"}):`, newHistory);
    setTimeout(() => {
      setLoadingButton(false);
      toast.success(`Dữ liệu ${type === "before" ? "trước bảo dưỡng" : "sau bảo dưỡng"} đã được lưu thành công`);
    }, 500);
  };
  if(tabKey === "nearest" && histories.length === 0) {
    return (
      <div className="text-center flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold">Khách hàng chưa từng bảo dưỡng trước đây</h2>
      </div>
    );  
  }
  
  return (
    <div>
      {tabKey === "nearest" && (
        <PartsFormTab
          initialValues={
            nearest
              ? Object.fromEntries(
                  parts.map((part) => [
                    part.key,
                    nearest.details[part.key as keyof typeof nearest.details]?.value ?? undefined,
                  ])
                )
              : {}
          }
          initialNotes={
            nearest
              ? Object.fromEntries(
                  parts.map((part) => [
                    part.key,
                    nearest.details[part.key as keyof typeof nearest.details]?.note ?? "",
                  ])
                )
              : {}
          }
          disabled
          showBefore
        />
      )}
     {tabKey === "note_before_maintenance" && (
  <PartsFormTab onSubmit={(values, notes) => handleSubmit(values, notes, "before")} showActions showBefore loadingButton={loadingButton}/>
)}
{tabKey === "note_after_maintenance" && (
  <PartsFormTab onSubmit={(values, notes) => handleSubmit(values, notes, "after")} showActions showBefore showAfter loadingButton={loadingButton}/>
)}
    </div>
  );
}