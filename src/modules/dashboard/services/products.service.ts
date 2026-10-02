import { api } from "@/shared/services/api";
import {
  ProductDetail,
  ProductImage,
  ProductPage,
  ProductPayload,
  ProductSortProperty,
  ProductSuggestion,
} from "@/shared/types/product";

type Id = number | string;

export type ProductListParams = {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: number;
  subCategorieId?: number;
  /** Só produtos com pelo menos uma avaliação visível (ranking). */
  onlyRated?: boolean;
  property?: ProductSortProperty;
  sort?: "ASC" | "DESC";
};

export const ProductsService = {
  /** GET /production/list — paginado (0-based); totais em `page.*`. */
  fetchProducts: async ({
    page = 0,
    size = 10,
    search,
    categoryId,
    subCategorieId,
    onlyRated,
    property,
    sort,
  }: ProductListParams = {}) => {
    const response = await api.request<ProductPage>({
      method: "GET",
      url: "/production/list",
      params: {
        page,
        size,
        search: search?.trim() || undefined,
        categoryId: categoryId || undefined,
        subCategorieId: subCategorieId || undefined,
        onlyRated: onlyRated || undefined,
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

  /** Imagens externas (`external:`) só saem do banco; as demais também do MinIO. */
  deleteImage: async (imageId: Id) => {
    await api.request({
      method: "DELETE",
      url: `/production/file/${imageId}`,
    });
  },

  /** GET /production/suggest — público; `q` com 2+ caracteres (senão 400), `limit` de 1 a 10. */
  suggest: async (q: string, limit = 8) => {
    const response = await api.request<ProductSuggestion[]>({
      method: "GET",
      url: "/production/suggest",
      params: { q: q.trim(), limit },
    });
    return response.data;
  },
};
