import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

export const ForgotPasswordService = async (email: string) => {
  try {
    const response = await api.request({
      url: "/auth/forgot-password",
      method: "POST",
      data: {
        email,
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
