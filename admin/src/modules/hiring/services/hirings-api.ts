import { hiringData } from "../mocks/career";
import {
  HiringStatusEnum,
  Hiring,
  HiringResponse,
  HiringResponseData,
} from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiResponse } from "@/types/api.type";

const MOCK_DELAY = 500;
type HiringFilter = {
  search?: string;
  page?: number;
  perPage?: number;
  status?: HiringStatusEnum;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
};
const mockGetHiringList = async (
  filter?: HiringFilter
): Promise<HiringResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        statusCode: 200,
        message: "Mock: Hiring list fetched successfully.",
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
            total: hiringData.length,
            totalPage: Math.ceil(hiringData.length / (filter?.perPage || 10)),
          },
        },
        data: hiringData,
      });
    }, MOCK_DELAY);
  });
};

const mockGetHiringDetails = async (
  _id: string
): Promise<HiringResponseData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = hiringData.find((job) => job._id === _id);
      if (found) {
        resolve({
          ...found,
        });
      } else {
        reject(new Error("Mock: Hiring not found."));
      }
    }, MOCK_DELAY);
  });
};

const mockCreateHiring = async (
  hiring: Hiring
): Promise<HiringResponseData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newHiring = { ...hiring, id: `${Date.now()}` };
      hiringData.push(newHiring);
      resolve(newHiring);
    }, MOCK_DELAY);
  });
};

const mockUpdateHiring = async (id: string, hiring: Hiring): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = hiringData.findIndex((job) => job._id === id);
      if (index !== -1) {
        hiringData[index] = { ...hiringData[index], ...hiring };
        resolve();
      } else {
        reject(new Error("Mock: Hiring not found."));
      }
    }, MOCK_DELAY);
  });
};

const mockDeleteHiring = async (id: string): Promise<void> => {
  console.log("Mock: Deleting hiring with ID:", id);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = hiringData.findIndex((job) => job._id === id);
      console.log("Mock: Hiring index found:", index);

      if (index !== -1) {
        hiringData.splice(index, 1);
        resolve();
      } else {
        reject(new Error("Mock: Hiring not found."));
      }
    }, MOCK_DELAY);
  });
};

const mockUpdateHiringStatus = async (
  id: string,
  status: HiringStatusEnum
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = hiringData.findIndex((job) => job._id === id);
      if (index !== -1) {
        hiringData[index].status = status;
        resolve();
      } else {
        reject(new Error("Mock: Hiring not found."));
      }
    }, MOCK_DELAY);
  });
};

export const hiringService = {
  getHiringList: mockGetHiringList,
  getHiringDetails: mockGetHiringDetails,
  createHiring: mockCreateHiring,
  updateHiring: mockUpdateHiring,
  deleteHiring: mockDeleteHiring,
  updateHiringStatus: mockUpdateHiringStatus,
};
