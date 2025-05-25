"use client";
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Button } from 'antd';
import {pendingAppointments} from "@/data/PendingAppointments";
import { mockDataTableManageCustomers, vehicleData } from '@/data/TableData';
import { CustomLink } from '@/shared/components/CustomerLink/CustomLink';
import { FaMotorcycle, FaUser, FaArrowLeft } from 'react-icons/fa';
import ViewVehicleModal from '../modals/ViewVehicleModal';
import ViewCustomerModal from '../modals/ViewCustomerModal';
import Tabs from './Tabs';

export default function MaintenanceDetails() {
    const [openVehicleModal, setOpenVehicleModal] = useState(false);
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [activeTab, setActiveTab] = useState("nearest");
  const [tabTransition, setTabTransition] = useState(false);
   useEffect(() => {
    const tab = localStorage.getItem("note_after_maintenance");
    if (tab) {
      setActiveTab(tab);
      localStorage.removeItem("note_after_maintenance"); 
    }
  }, []);
    const handleTabChange = (key: string) => {
    setTabTransition(true);
    setTimeout(() => {
      setActiveTab(key);
      setTabTransition(false);
    }, 200);
  };
  const tabs = {
    nearest:"Bảo dưỡng gần nhất",
    note_before_maintenance:"Ghi chú trước bảo dưỡng",
    note_after_maintenance:"Ghi chú sau bảo dưỡng",
  };
    const params = useParams();
    const appointment = pendingAppointments.find((appt) => appt.id === Number(params.id));
    if (!appointment) {
        return <div>Appointment not found</div>;
    }
    const vehicle = vehicleData.find((v) => v.id === appointment.vehicle_id);
    const customer = mockDataTableManageCustomers.find((cus) => cus.id === appointment.customer_id);
  return (
    <div>
        <div className="flex justify-between">
            <CustomLink href="/technician/maintenance">
            <Button icon={<FaArrowLeft  />}> Quay lại</Button>
            </CustomLink>
            <div className="flex gap-4">
                <Button icon={<FaMotorcycle />} onClick={() => setOpenVehicleModal(true)}> Thông tin xe</Button>
                <Button icon={<FaUser />} onClick={() => setOpenCustomerModal(true)}> Thông tin khách hàng</Button>
            </div>
        </div>
        <div className="w-full my-5">
                <div className="flex gap-2">
                  {Object.entries(tabs).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleTabChange(key)}
                      className={`px-4 py-2 rounded-[30px] font-medium cursor-pointer ${
                        activeTab === key
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black hover:bg-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
                <div
                  className={`relative transition-all duration-300 ${
                    tabTransition
                      ? "opacity-0 translate-x-4 pointer-events-none"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  {activeTab === "nearest" && (
                    <Tabs tabKey={activeTab} vehicleID={vehicle?.id}/>
                  )}
                  {activeTab === "note_before_maintenance" && <Tabs tabKey={activeTab}/>}
                  {activeTab === "note_after_maintenance" && <Tabs tabKey={activeTab}/>}
                </div>
        <ViewVehicleModal vehicle={vehicle??null} open={openVehicleModal} onClose={() => setOpenVehicleModal(false)} />
        <ViewCustomerModal customer={customer ?? null} open={openCustomerModal} onClose={() => setOpenCustomerModal(false)} />
    </div>
  )
}
