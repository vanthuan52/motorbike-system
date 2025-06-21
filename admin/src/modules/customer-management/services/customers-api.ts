import { API_ENDPOINTS } from "@/constants/api-endpoint";
import {
  ENUM_USER_STATUS,
  UserProfileResponse,
  UserProfileResponseData,
} from "../types";
import { mockDataTableManageCustomers } from "../mocks/customer-data";

const MOCK_DELAY = 500;
type CustomerFilter = {
  search?: string;
  gender?: string;
  page?: number;
  perPage?: number;
  status?: ENUM_USER_STATUS;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
};

const getCustomerList = async (
  filter?: CustomerFilter
): Promise<UserProfileResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        statusCode: 200,
        message: "Mock: Customer list fetched successfully.",
        _metadata: {
          language: "en",
          timestamp: Date.now(),
          timezone: "Asia/Ho_Chi_Minh",
          path: API_ENDPOINTS.ADMIN.HIRING,
          version: "1",
          pagination: {
            availableSearch: ["name", "status"],
            page: filter?.page || 1,
            perPage: filter?.perPage || 10,
            orderBy: filter?.orderBy || "createdAt",
            orderDirection: filter?.orderDirection || "asc",
            availableOrderBy: ["createdAt"],
            availableOrderDirection: ["asc", "desc"],
            total: mockDataTableManageCustomers.length,
            totalPage: Math.ceil(
              mockDataTableManageCustomers.length / (filter?.perPage || 10)
            ),
          },
        },
        data: mockDataTableManageCustomers,
      });
    }, MOCK_DELAY);
  });
};

const getCustomerDetails = async (
  _id: string
): Promise<UserProfileResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = mockDataTableManageCustomers.find(
        customer => customer.id === _id
      );
      if (found) {
        resolve({
          ...found,
        });
      } else {
        reject(new Error("Customer not found"));
      }
    }, MOCK_DELAY);
  });
};

const createCustomer = async (
  customer: UserProfileResponse
): Promise<UserProfileResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newCustomer = { ...customer, id: `${Date.now()}` };
      mockDataTableManageCustomers.push(newCustomer);
      resolve(newCustomer);
    }, MOCK_DELAY);
  });
};

const updateCustomer = async (
  _id: string,
  customer: UserProfileResponse
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDataTableManageCustomers.findIndex(
        cust => cust.id === _id
      );
      if (index !== -1) {
        mockDataTableManageCustomers[index] = {
          ...mockDataTableManageCustomers[index],
          ...customer,
        };
        resolve(mockDataTableManageCustomers[index]);
      } else {
        reject(new Error("Customer not found"));
      }
    }, MOCK_DELAY);
  });
};

const deleteCustomer = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDataTableManageCustomers.findIndex(
        customer => customer.id === id
      );
      if (index !== -1) {
        mockDataTableManageCustomers.splice(index, 1);
        resolve();
      } else {
        reject(new Error("Customer not found"));
      }
    }, MOCK_DELAY);
  });
};

const updateCustomerStatus = async (
  id: string,
  status: ENUM_USER_STATUS
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDataTableManageCustomers.findIndex(
        customer => customer.id === id
      );
      if (index !== -1) {
        mockDataTableManageCustomers[index].status = status;
        resolve();
      } else {
        reject(new Error("Customer not found"));
      }
    }, MOCK_DELAY);
  });
};

export const customerServices = {
  getCustomerList: getCustomerList,
  getCustomerDetails: getCustomerDetails,
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  deleteCustomer: deleteCustomer,
  updateCustomerStatus: updateCustomerStatus,
};
