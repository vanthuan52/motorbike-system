import axios from "@/lib/axios";
import { mockCategory } from "../mocks/category-data";
import { ApiResponse } from "../types";
import { Category } from "../types";

const MOCK_API = true;
const MOCK_DELAY = 500;
type CategoryFilter = {
  name?: string;
  vehicle_company_id?: string;
  page?: number;
  limit?: number;
};

const mockGetCategories = (
  filter?: CategoryFilter
): Promise<ApiResponse<{ categories: Category[]; total: number }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = mockCategory;
      if (filter?.name) {
        filtered = filtered.filter((c) =>
          c.name.toLowerCase().includes(filter.name!.toLowerCase())
        );
      }
      if (filter?.vehicle_company_id) {
        filtered = filtered.filter(
          (c) => c.vehicle_company_id === filter.vehicle_company_id
        );
      }
      const page = filter?.page || 1;
      const limit = filter?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paged = filtered.slice(start, end);

      const response: ApiResponse<{ categories: Category[]; total: number }> = {
        status: true,
        statusCode: 200,
        message: "",
        data: {
          categories: paged,
          total: filtered.length,
        },
      };
      resolve(response);
    }, MOCK_DELAY);
  });
};

const mockGetCategoryDetails = (
  slug: string
): Promise<ApiResponse<{ category: Category | null }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundCategory = mockCategory.find((c) => c.slug === slug);

      if (foundCategory) {
        const response: ApiResponse<{ category: Category | null }> = {
          status: true,
          statusCode: 200,
          message: "",
          data: {
            category: foundCategory,
          },
        };
        resolve(response);
      } else {
        const error: ApiResponse<{ category: null }> = {
          status: false,
          statusCode: 404,
          message: "Category not found",
          data: {
            category: null,
          },
        };
        reject(error);
      }
    }, MOCK_DELAY);
  });
};

const mockCreateCategory = (
  category: Category
): Promise<ApiResponse<{ category: Category }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundCategory = mockCategory.find((c) => c.slug === category.slug);
      if (foundCategory) {
        const error: ApiResponse<{ category: null }> = {
          status: false,
          statusCode: 400,
          message: "Category already exists",
          data: {
            category: null,
          },
        };
        reject(error);
      } else {
        mockCategory.push(category);
        const response: ApiResponse<{ category: Category }> = {
          status: true,
          statusCode: 201,
          message: "Category created successfully",
          data: {
            category: mockCategory[0],
          },
        };
        resolve(response);
      }
    }, MOCK_DELAY);
  });
};

const mockUpdateCategory = (
  slug: string,
  category: Category
): Promise<ApiResponse<{ category: Category }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCategory.findIndex((c) => c.slug === slug);

      if (index !== -1) {
        mockCategory[index] = { ...mockCategory[index], ...category };
        const response: ApiResponse<{ category: Category }> = {
          status: true,
          statusCode: 200,
          message: "Category updated successfully",
          data: {
            category: mockCategory[index],
          },
        };
        resolve(response);
      } else {
        const error: ApiResponse<{ category: null }> = {
          status: false,
          statusCode: 404,
          message: "Category not found",
          data: {
            category: null,
          },
        };
        reject(error);
      }
    }, MOCK_DELAY);
  });
};

const mockDeleteCategory = (
  slug: string
): Promise<ApiResponse<{ category: Category }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundCategory = mockCategory.find((c) => c.slug === slug);

      if (foundCategory) {
        const index = mockCategory.indexOf(foundCategory);
        mockCategory.splice(index, 1);
        const response: ApiResponse<{ category: Category }> = {
          status: true,
          statusCode: 200,
          message: "Category deleted successfully",
          data: {
            category: foundCategory,
          },
        };
        resolve(response);
      } else {
        const error: ApiResponse<{ category: null }> = {
          status: false,
          statusCode: 404,
          message: "Category not found",
          data: {
            category: null,
          },
        };
        reject(error);
      }
    }, MOCK_DELAY);
  });
};

const mockUpdateCategoryStatus = (
  slug: string,
  status: boolean
): Promise<ApiResponse<{ category: Category }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundCategory = mockCategory.find((c) => c.slug === slug);

      if (foundCategory) {
        const updatedCategory = { ...foundCategory, status };
        const response: ApiResponse<{ category: Category }> = {
          status: true,
          statusCode: 200,
          message: "Category status updated successfully",
          data: {
            category: updatedCategory,
          },
        };
        resolve(response);
      } else {
        const error: ApiResponse<{ category: null }> = {
          status: false,
          statusCode: 404,
          message: "Category not found",
          data: {
            category: null,
          },
        };
        reject(error);
      }
    }, MOCK_DELAY);
  });
};

const categoriesService = {
  mockGetCategories(
    filter?: CategoryFilter
  ): Promise<ApiResponse<{ categories: Category[]; total: number }>> {
    if (MOCK_API) return mockGetCategories(filter);
    return axios.get("/categories", { params: filter });
  },
  mockGetCategoryDetails(
    slug: string
  ): Promise<ApiResponse<{ category: Category | null }>> {
    if (MOCK_API) {
      return mockGetCategoryDetails(slug);
    }
    return axios.get(`/categories/${slug}`);
  },
  mockCreateCategory(
    category: Category
  ): Promise<ApiResponse<{ category: Category }>> {
    if (MOCK_API) {
      return mockCreateCategory(category);
    }
    return axios.post("/categories", {});
  },
  mockUpdateCategory(
    slug: string,
    category: Category
  ): Promise<ApiResponse<{ category: Category }>> {
    if (MOCK_API) {
      return mockUpdateCategory(slug, category);
    }
    return axios.put(`/categories/${slug}`, {});
  },
  mockDeleteCategory(
    slug: string
  ): Promise<ApiResponse<{ category: Category }>> {
    if (MOCK_API) {
      return mockDeleteCategory(slug);
    }
    return axios.delete(`/categories/${slug}`);
  },
  mockUpdateCategoryStatus(
    slug: string,
    status: boolean
  ): Promise<ApiResponse<{ category: Category }>> {
    if (MOCK_API) {
      return mockUpdateCategoryStatus(slug, status);
    }
    return axios.patch(`/categories/${slug}`);
  },
};

export default categoriesService;
