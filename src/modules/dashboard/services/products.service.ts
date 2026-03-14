import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

type Product = {
  id: number;
  name: string;
  description: string;
  slug: string;
};

interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

type PaginatedProductsResponse = {
  content: Product[];
  page: PageInfo;
};

type CreateProduct = Omit<Product, "id">;
export const ProductsService = {
  fetchProducts: async () => {
    try {
      const response = await api.request<PaginatedProductsResponse>({
        method: "GET",
        url: "/production/list?page=0&size=10",
      });
      return response.data;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      const message =
        (error.response?.data?.message as string) || error.message;
      throw new Error(`${message}`);
    }
  },
  fechProductCreate: async (data: CreateProduct) => {
    try {
      const response = await api.request({
        method: "POST",
        url: "/production/",
        data,
      });
      return response;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      const message =
        (error.response?.data?.message as string) || error.message;
      throw new Error(`${message}`);
    }
  },
  fetchProductUpdate: async (data: Product) => {
    try {
      const response = await api.request({
        method: "PUT",
        url: "/production/" + data.id,
        data,
      });
      return response;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      const message =
        (error.response?.data?.message as string) || error.message;
      throw new Error(`${message}`);
    }
  },
  fetchProductDelete: async (id: number) => {
    try {
      const response = await api.request({
        method: "DELETE",
        url: "/production/" + id,
      });
      return response;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      const message =
        (error.response?.data?.message as string) || error.message;
      throw new Error(`${message}`);
    }
  },
};
