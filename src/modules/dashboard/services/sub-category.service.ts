import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

type CreateSubCategorie = {
  name: string;
  description: string;
  slug: string;
  categorieId: string;
};

export const SubCategorieService = {
  create: async (data: CreateSubCategorie) => {
    try {
      const response = await api.request({
        method: "POST",
        url: "/sub-categorie/create",
        data,
      });
      if (response.status !== 200 || response.data.status !== 201) {
        throw Error(response.data.message);
      }
      return response.data;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      const message = (error.response?.data?.message as string) || error.message;
      throw new Error(`${message}`);
    }
  },
};
