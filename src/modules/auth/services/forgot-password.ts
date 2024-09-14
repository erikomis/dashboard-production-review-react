import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

export const ForgotPasswordService = async (email: string) => {
  try {
    const response = await api.request({
      url: "/auth/send-recovery-code/send",
      method: "POST",
      data: {
        email,
      },
    });
    return response;
  } catch (er) {
    const error = er as AxiosError<{ message: string }>;
    const message = (error.response?.data?.message as string) || error.message;
    throw new Error(`${message}`);
  }
};
