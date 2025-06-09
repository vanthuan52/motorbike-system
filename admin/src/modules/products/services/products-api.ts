import axios from "@/lib/axios";
import { mockProducts } from "../mocks/Products";
import { ApiResponse } from "../types";
import { Product } from "../types";

const MOCK_API = true;
const MOCK_DELAY = 1000;
const mockGetProducts = (): Promise<ApiResponse<{ products: Product[] }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response: ApiResponse<{ products: Product[] }> = {
        status: true,
        statusCode: 200,
        message: "",
        data: {
          products: mockProducts,
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
  getProducts(): Promise<ApiResponse<{ products: Product[] }>> {
    if (MOCK_API) return mockGetProducts();
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
