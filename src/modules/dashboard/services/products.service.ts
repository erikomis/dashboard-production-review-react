import { api } from "@/shared/services/api";
import {
  ProductDetail,
  ProductImage,
  ProductPage,
  ProductPayload,
} from "@/shared/types/product";

type Id = number | string;

export type ProductListParams = {
  page?: number;
  size?: number;
  search?: string;
  property?: string;
  sort?: "ASC" | "DESC";
};

export const ProductsService = {
  /** GET /production/list — paginado (0-based); totais em `page.*`. */
  fetchProducts: async ({ page = 0, size = 10, search, property, sort }: ProductListParams = {}) => {
    const response = await api.request<ProductPage>({
      method: "GET",
      url: "/production/list",
      params: {
        page,
        size,
        search: search?.trim() || undefined,
        property,
        sort,
      },
    });
    return response.data;
  },

  getById: async (id: Id) => {
    const response = await api.request<ProductDetail>({
      method: "GET",
      url: `/production/${id}`,
    });
    return response.data;
  },

  create: async (data: ProductPayload) => {
    const response = await api.request<ProductDetail>({
      method: "POST",
      url: "/production/add",
      data,
    });
    return response.data;
  },

  update: async (id: Id, data: ProductPayload) => {
    const response = await api.request<ProductDetail>({
      method: "PUT",
      url: `/production/update/${id}`,
      data,
    });
    return response.data;
  },

  /** 409 se o produto tiver imagens. */
  delete: async (id: Id) => {
    await api.request({
      method: "DELETE",
      url: `/production/delete/${id}`,
    });
  },

  /** POST /production/file (multipart: `file`, `idProduct`). */
  uploadImage: async (idProduct: Id, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("idProduct", String(idProduct));
    const response = await api.request<ProductImage>({
      method: "POST",
      url: "/production/file",
      data: formData,
      // sobrescreve o JSON padrão da instância; o navegador define o boundary
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteImage: async (imageId: Id) => {
    await api.request({
      method: "DELETE",
      url: `/production/file/${imageId}`,
    });
  },
};
