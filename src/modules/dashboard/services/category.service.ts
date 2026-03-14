/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

type CreateCategore = {
  name: string;
  description: string;
  slug: string;
};

type Category = {
  id: number;
  name: string;
  description: string;
  slug: string;
};

export const CategoryService = {
  list: async () => {
    try {
      const response = await api.request<Category[]>({
        method: "GET",
        url: "/category/list",
      });
      return response.data;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      const message =
        (error.response?.data?.message as string) || error.message;
      throw new Error(`${message}`);
    }
  },

  create: async (data: CreateCategore) => {
    try {
      const response = await api.request({
        method: "POST",
        url: "/category/",
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

  update: async (data: Category) => {
    try {
      const response = await api.request({
        method: "PUT",
        url: "/category/" + data.id,
        data,
      });
      return response;
    } catch (error: any) {
      if (error) {
        throw Error(error.response.data.message);
      }
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.request({
        method: "DELETE",
        url: "/category/" + id,
      });

      return response;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      const message =
        (error.response?.data?.message as string) || error.message;
      throw new Error(`${message}`);
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.request({
        method: "GET",
        url: "/category/" + id,
      });
      if (response.status !== 200 || response.data.status !== 201) {
        throw Error(response.data.message);
      }
      return response.data;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      const message =
        (error.response?.data?.message as string) || error.message;
      throw new Error(`${message}`);
    }
  },
};
