import { api } from "../../../shared/services/api";

export const ProductsService = {
  fetchProducts: async () => {
    try {
      const response = await api.request({
        method: "GET",
        url: "/production/list?page=0&size=10",

      });
      if (response.status !== 200 || response.data.status !== 201) {
        throw Error(response.data.message);
      }
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error) {
        throw Error(error.response.data.message);
      }
    }
  },
};
