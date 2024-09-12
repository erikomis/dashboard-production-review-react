import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

export const SignUpService = async (
  name: string,
  email: string,
  username: string,
  password: string
) => {
  try {
    const response = await api.request({
      url: "/auth/sign-up",
      method: "POST",
      data: {
        name,
        email,
        username,
        password,
      },
    });

    return response;
  } catch (er) {
    const error = er as AxiosError;
    const message = error.response?.data || error.message;
    throw new Error(`${message}`);
    
  }
};
