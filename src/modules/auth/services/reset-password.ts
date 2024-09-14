import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

export const ResetPasswordService = async (
  email: string,
  password: string,
  recoveryCode: string
) => {
  try {
    const response = await api.request({
      url: "/auth/recovery-code/password",
      method: "PATCH",
      data: {
        email,
        password,
        recoveryCode,
      },
    });
    return response;
  } catch (er) {
    const error = er as AxiosError<{ message: string }>;
    const message = (error.response?.data?.message as string) || error.message;
    throw new Error(`${message}`);
  }
};
