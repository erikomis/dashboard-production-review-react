import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

export const ActivateAccountService = async (token: string) => {
  try {
   const response = api.request({
      url: "/auth/activate-account",
      method: "Get",
      params: {
        token,
      },
    });
    return response;
  } catch (er) {
    const error = er as AxiosError;
    const status = error.response?.status;
    const message = error.response?.data || error.message;
    throw new Error(`Request failed with status ${status}: ${message}`);
  }
};
