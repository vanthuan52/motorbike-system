import axios from "@/lib/axios";
import { mockProducts } from "../mocks/Products";
import { ApiResponse } from "../types";
import { Product } from "../types";

const MOCK_API = true;
const MOCK_DELAY = 500;
type ProductFilter = {
  name?: string;
  category_id?: string;
  page?: number;
  limit?: number;
};
const mockGetProducts = (
  filter?: ProductFilter
): Promise<ApiResponse<{ products: Product[]; total: number }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = mockProducts;
      if (filter?.name) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(filter.name!.toLowerCase())
        );
      }
      if (filter?.category_id) {
        filtered = filtered.filter((p) => p.category_id === filter.category_id);
      }
      const page = filter?.page || 1;
      const limit = filter?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paged = filtered.slice(start, end);

      const response: ApiResponse<{ products: Product[]; total: number }> = {
        status: true,
        statusCode: 200,
        message: "",
        data: {
          products: paged,
          total: filtered.length,
        },
      };

      resolve(response);
    }, MOCK_DELAY);
  });
};
const mockGetProductDetails = (
  slug: string
): Promise<ApiResponse<{ product: Product | null }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = mockProducts.find(
        (product) => product.slug === slug
      );

      if (foundProduct) {
        const response: ApiResponse<{ product: Product }> = {
          status: true,
          statusCode: 200,
          message: "",
          data: {
            product: foundProduct,
          },
        };

        resolve(response);
      } else {
        const error: ApiResponse<{ product: null }> = {
          status: false,
          statusCode: 404,
          message: "Product not found",
          data: {
            product: null,
          },
        };
        reject(error);
      }
    }, MOCK_DELAY);
  });
};
const mockUpdateProduct = (
  slug: string
): Promise<ApiResponse<{ product: Product }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = mockProducts.find(
        (product) => product.slug === slug
      );
      if (foundProduct) {
        const response: ApiResponse<{ product: Product }> = {
          status: true,
          statusCode: 200,
          message: "Product updated successfully",
          data: {
            product: foundProduct,
          },
        };
        resolve(response);
      }
      const error: ApiResponse<{ product: null }> = {
        status: false,
        statusCode: 404,
        message: "Product not found",
        data: {
          product: null,
        },
      };
      reject(error);
    }, MOCK_DELAY);
  });
};
const mockCreateProduct = (): Promise<ApiResponse<{ product: Product }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response: ApiResponse<{ product: Product }> = {
        status: true,
        statusCode: 201,
        message: "Product created successfully",
        data: {
          product: mockProducts[0],
        },
      };

      resolve(response);
    }, MOCK_DELAY);
  });
};
const mockDeleteProduct = (
  slug: string
): Promise<ApiResponse<{ product: Product }>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = mockProducts.find(
        (product) => product.slug === slug
      );
      if (foundProduct) {
        const response: ApiResponse<{ product: Product }> = {
          status: true,
          statusCode: 200,
          message: "Product deleted successfully",
          data: {
            product: mockProducts[0],
          },
        };
        resolve(response);
      }
      const error: ApiResponse<{ product: null }> = {
        status: false,
        statusCode: 404,
        message: "Product not found",
        data: {
          product: null,
        },
      };
      reject(error);
    }, MOCK_DELAY);
  });
};
const productsService = {
  getProducts(
    filter?: ProductFilter
  ): Promise<ApiResponse<{ products: Product[] }>> {
    if (MOCK_API) return mockGetProducts(filter);
    return axios.get("/products");
  },
  getProductDetails(
    slug: string
  ): Promise<ApiResponse<{ product: Product | null }>> {
    if (MOCK_API) return mockGetProductDetails(slug);
    return axios.get(`/products/${slug}`);
  },
  updateProduct(product: Product): Promise<ApiResponse<{ product: Product }>> {
    if (MOCK_API) return mockUpdateProduct(product.slug);
    return axios.put(`/product/${product.slug}`, product);
  },
  createProduct(product: Product): Promise<ApiResponse<{ product: Product }>> {
    if (MOCK_API) return mockCreateProduct();
    return axios.post("/products", product);
  },
  deleteProduct(slug: string): Promise<ApiResponse<{ product: Product }>> {
    if (MOCK_API) return mockDeleteProduct(slug);
    return axios.delete(`/products/${slug}`);
  },
};

export default productsService;
