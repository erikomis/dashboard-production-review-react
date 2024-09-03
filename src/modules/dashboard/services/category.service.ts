/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../../shared/services/api";
import { ErrorResponse } from "../../../shared/types/errorResponse";

export const CategoryService = {
  list: async () => {
    try {
      const response = await api.request({
        method: "GET",
        url: "/category/list",
      });
      if (response.status !== 200 || response.data.status !== 201) {
        throw Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      if (error) {
        throw Error(error.response.data.message);
      }
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.request({
        method: "POST",
        url: "/category/create",
        data,
      });
      if (response.status !== 200 || response.data.status !== 201) {
        throw Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      if (error) {
        throw Error(error.response.data.message);
      }
    }
  },

  update: async (data: any) => {
    try {
      const response = await api.request({
        method: "PUT",
        params: { id: data.id },
        url: "/category/update",
        data,
      });
      if (response.status !== 200 || response.data.status !== 201) {
        throw Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      if (error) {
        throw Error(error.response.data.message);
      }
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.request({
        method: "DELETE",
        params: { id },
        url: "/category/delete",
      });
      if (response.status !== 200 || response.data.status !== 201) {
        throw Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      if (error) {
        throw Error(error.response.data.message);
      }
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.request({
        method: "GET",
        params: { id },
        url: "/category/get",
      });
      if (response.status !== 200 || response.data.status !== 201) {
        throw Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      if (error as ErrorResponse) {
        throw Error(error.response.data.message);
      }
    }
  },
};
