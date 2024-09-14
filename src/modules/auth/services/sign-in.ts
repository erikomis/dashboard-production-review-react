import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

type LoginProps = {
  username: string;
  password: string;
};

export const SignInService = async ({ username, password }: LoginProps) => {
  try {
    const response = await api.request<{
      token: string;
      refreshToken: string;
    }>({
      url: "/auth/sign-in",
      method: "POST",
      data: {
        username,
        password,
      },
    });
    return response;
  } catch (er) {
    const error = er as AxiosError<{ message: string }>;
    const message = (error.response?.data?.message as string) || error.message;
    throw new Error(`${message}`);
  }
};
