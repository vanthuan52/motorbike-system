// service/vehicleCompanyService.ts
import { adminApi } from "@/lib/axios";
import { VehicleCompanyTypes, ApiResponse } from "../types";
import { mockDataTableVehicleCompany } from "../mocks/vehicle-company";

const MOCK_API = true;
const MOCK_DELAY = 500;

const mockGetAll = (): Promise<ApiResponse<VehicleCompanyTypes[]>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: true,
        statusCode: 200,
        message: "Success",
        data: mockDataTableVehicleCompany,
      });
    }, MOCK_DELAY);
  });

const mockCreate = (
  data: Omit<VehicleCompanyTypes, "id">
): Promise<ApiResponse<VehicleCompanyTypes>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const newId = `vc-${mockDataTableVehicleCompany.length + 1}`;
      const newItem: VehicleCompanyTypes = { ...data, id: newId };
      mockDataTableVehicleCompany.push(newItem);
      resolve({
        status: true,
        statusCode: 201,
        message: "Created",
        data: newItem,
      });
    }, MOCK_DELAY);
  });

const mockUpdate = (
  id: string,
  data: Omit<VehicleCompanyTypes, "id">
): Promise<ApiResponse<VehicleCompanyTypes>> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDataTableVehicleCompany.findIndex((item) => item.id === id);
      if (index !== -1) {
        mockDataTableVehicleCompany[index] = { ...mockDataTableVehicleCompany[index], ...data };
        resolve({
          status: true,
          statusCode: 200,
          message: "Updated",
          data: mockDataTableVehicleCompany[index],
        });
      } else {
        reject({ status: false, statusCode: 404, message: "Not found", data: null });
      }
    }, MOCK_DELAY);
  });

const mockRemove = (id: string): Promise<ApiResponse<null>> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDataTableVehicleCompany.findIndex((item) => item.id === id);
      if (index !== -1) {
        mockDataTableVehicleCompany.splice(index, 1);
        resolve({
          status: true,
          statusCode: 200,
          message: "Deleted",
          data: null,
        });
      } else {
        reject({ status: false, statusCode: 404, message: "Not found", data: null });
      }
    }, MOCK_DELAY);
  });

const vehicleCompanyService = {
  getAll(): Promise<ApiResponse<VehicleCompanyTypes[]>> {
    return MOCK_API ? mockGetAll() : adminApi.get("/vehicle-companies");
  },
  create(data: Omit<VehicleCompanyTypes, "id">): Promise<ApiResponse<VehicleCompanyTypes>> {
    return MOCK_API ? mockCreate(data) : adminApi.post("/vehicle-companies", data);
  },
  update(id: string, data: Omit<VehicleCompanyTypes, "id">): Promise<ApiResponse<VehicleCompanyTypes>> {
    return MOCK_API ? mockUpdate(id, data) : adminApi.put(`/vehicle-companies/${id}`, data);
  },
  remove(id: string): Promise<ApiResponse<null>> {
    return MOCK_API ? mockRemove(id) : adminApi.delete(`/vehicle-companies/${id}`);
  },
};

export default vehicleCompanyService;
