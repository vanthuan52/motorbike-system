"use client";

import { useState, useMemo, useEffect } from "react";
import { Select, Typography, Card, Empty, Image } from "antd";
const { Title, Text } = Typography;

import { vehicleData, mockDataTableVehicleType } from "@/data/TableData";
import TablePagination from "@/components/ui/Table/TablePagination";

export default function VehicleManagement() {
  const [pageSize, setPageSize] = useState(3);
  const customerId = "cus-01";
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transitioning, setTransitioning] = useState(false);
  const [pageToShow, setPageToShow] = useState(currentPage);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;

    setDirection(newPage > currentPage ? "left" : "right"); // xác định hướng
    setTransitioning(true);

    setTimeout(() => {
      setPageToShow(newPage);
      setCurrentPage(newPage);
      setTransitioning(false);
    }, 300);
  };
  const vehicleTypeMap = useMemo(() => {
    const map: Record<string, string> = {};
    mockDataTableVehicleType.forEach((t) => (map[t.id] = t.name));
    return map;
  }, []);

  const colorOptions = useMemo(
    () => Array.from(new Set(vehicleData.map((v) => v.color))).filter(Boolean),
    []
  );

  const filteredVehicles = useMemo(
    () =>
      vehicleData.filter(
        (v) =>
          v.customer_id === customerId &&
          (selectedType === "all" || v.vehicle_type_id === selectedType) &&
          (selectedColor === "all" || v.color === selectedColor)
      ),
    [customerId, selectedType, selectedColor]
  );

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredVehicles.length / pageSize));
    if (currentPage > maxPage) {
      setCurrentPage(1);
    }
  }, [filteredVehicles, currentPage, pageSize]);

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="container py-10">
        <div className="mb-6">
          <Title level={3}>Phương tiện của bạn</Title>
          <Text type="secondary">Xem danh sách phương tiện của bạn</Text>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex flex-row gap-4">
            <Select
              className="w-full md:w-48"
              value={selectedType}
              onChange={(v) => {
                setSelectedType(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "all", label: "Tất cả loại xe" },
                ...mockDataTableVehicleType.map((t) => ({
                  value: t.id,
                  label: t.name,
                })),
              ]}
              placeholder="Loại xe"
            />
            <Select
              className="w-full md:w-48"
              value={selectedColor}
              onChange={(v) => {
                setSelectedColor(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "all", label: "Tất cả màu xe" },
                ...colorOptions.map((c) => ({ value: c, label: c })),
              ]}
              placeholder="Màu xe"
            />
          </div>
          <TablePagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredVehicles.length / pageSize)}
            pageSize={pageSize}
            onPageChange={(page) => handlePageChange(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
              setPageToShow(1);
            }}
          />
        </div>

        {paginatedVehicles.length === 0 ? (
          <Empty description="Không có phương tiện phù hợp" />
        ) : (
          <div className="relative min-h-[200px]">
            <div
              key={pageToShow}
              className={`
      transition-transform duration-500 ease-in-out 
      ${
        transitioning
          ? direction === "left"
            ? "animate-slide-out-left"
            : "animate-slide-out-right"
          : direction === "left"
          ? "animate-slide-in-left"
          : "animate-slide-in-right"
      }
    `}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedVehicles.map((v) => (
                  <Card
                    key={v.id}
                    title={v.license_plate}
                    cover={
                      <Image
                        src={v.image_file_name || "/images/placeholder.png"}
                        alt={v.vehicle_model || ""}
                        className="!h-40 object-cover"
                      />
                    }
                  >
                    <p>
                      <strong>Model:</strong> {v.vehicle_model}
                    </p>
                    <p>
                      <strong>Màu:</strong> {v.color}
                    </p>
                    <p>
                      <strong>Loại xe:</strong>{" "}
                      {vehicleTypeMap[v.vehicle_type_id] || "Không rõ"}
                    </p>
                    <p>
                      <strong>Số máy:</strong> {v.engine_number}
                    </p>
                    <p>
                      <strong>Số khung:</strong> {v.chassis_number}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
