import { AxiosError } from "axios";
import { api } from "@/shared/services/api";

export const ActivateAccountService = async (token: string) => {
  try {
    const response = api.request({
      url: "/auth/activate/" + token,
      method: "Get",
    });
    return response;
  } catch (er) {
    const error = er as AxiosError<{ message: string }>;
    const message = (error.response?.data?.message as string) || error.message;
    throw new Error(`${message}`);
  }
};
