import axios from "@/lib/axios";
import { mockDataTableManageEmployees } from "../mocks/employees";
import { ApiResponse, EmployeeType } from "../types";

const MOCK_API = true;
const MOCK_DELAY = 500;

type EmployeeFilter = {
  name?: string;
  position?: string;
  page?: number;
  limit?: number;
};

const mockGetEmployees = (
  filter?: EmployeeFilter
): Promise<ApiResponse<{ employees: EmployeeType[]; total: number }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockDataTableManageEmployees];

      if (filter?.name) {
        filtered = filtered.filter((e) =>
          `${e.first_name} ${e.last_name}`.toLowerCase().includes(filter.name!.toLowerCase())
        );
      }

      if (filter?.position) {
        filtered = filtered.filter((e) =>
          e.position?.toLowerCase().includes(filter.position!.toLowerCase())
        );
      }
      

      const page = filter?.page || 1;
      const limit = filter?.limit || 10;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      resolve({
        status: true,
        statusCode: 200,
        message: "",
        data: { employees: paginated, total: filtered.length },
      });
    }, MOCK_DELAY);
  });
};

const mockGetEmployeeDetails = (
  id: string
): Promise<ApiResponse<{ employee: EmployeeType | null }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = mockDataTableManageEmployees.find((e) => e.id === id);

      if (found) {
        resolve({
          status: true,
          statusCode: 200,
          message: "",
          data: { employee: found },
        });
      } else {
        reject({
          status: false,
          statusCode: 404,
          message: "Employee not found",
          data: { employee: null },
        });
      }
    }, MOCK_DELAY);
  });
};

const mockUpdateEmployee = (
  id: string,
  data: Partial<EmployeeType>
): Promise<ApiResponse<{ employee: EmployeeType }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = mockDataTableManageEmployees.find((e) => e.id === id);

      if (found) {
        Object.assign(found, data);
        resolve({
          status: true,
          statusCode: 200,
          message: "Employee updated successfully",
          data: { employee: found },
        });
      } else {
        reject({
          status: false,
          statusCode: 404,
          message: "Employee not found",
          data: { employee: null },
        });
      }
    }, MOCK_DELAY);
  });
};


const mockCreateEmployee = (
  employee: EmployeeType
): Promise<ApiResponse<{ employee: EmployeeType }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        mockDataTableManageEmployees.push(employee);

      resolve({
        status: true,
        statusCode: 201,
        message: "Employee created successfully",
        data: { employee },
      });
    }, MOCK_DELAY);
  });
};

const mockDeleteEmployee = (
  id: string
): Promise<ApiResponse<{ employee: EmployeeType | null }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDataTableManageEmployees.findIndex((e) => e.id === id);
      if (index !== -1) {
        const deleted = mockDataTableManageEmployees.splice(index, 1)[0];
        resolve({
          status: true,
          statusCode: 200,
          message: "Employee deleted successfully",
          data: { employee: deleted },
        });
      } else {
        reject({
          status: false,
          statusCode: 404,
          message: "Employee not found",
          data: { employee: null },
        });
      }
    }, MOCK_DELAY);
  });
};

const employeeService = {
  getEmployees(
    filter?: EmployeeFilter
  ): Promise<ApiResponse<{ employees: EmployeeType[]; total: number }>> {
    if (MOCK_API) return mockGetEmployees(filter);
    return axios.get("/employees", { params: filter });
  },

  getEmployeeDetails(
    id: string
  ): Promise<ApiResponse<{ employee: EmployeeType | null }>> {
    if (MOCK_API) return mockGetEmployeeDetails(id);
    return axios.get(`/employees/${id}`);
  },

  updateEmployee(id: string, data: Partial<EmployeeType>): Promise<ApiResponse<{ employee: EmployeeType }>> {
    if (MOCK_API) return mockUpdateEmployee(id, data);
    return axios.put(`/employees/${id}`, data);
  },

  createEmployee(employee: EmployeeType): Promise<ApiResponse<{ employee: EmployeeType }>> {
    if (MOCK_API) return mockCreateEmployee(employee);
    return axios.post("/employees", employee);
  },

  deleteEmployee(id: string): Promise<ApiResponse<{ employee: EmployeeType | null }>> {
    if (MOCK_API) return mockDeleteEmployee(id);
    return axios.delete(`/employees/${id}`);
  },
};

export default employeeService;
