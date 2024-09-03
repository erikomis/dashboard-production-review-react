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
  } catch (error: Error | any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.request.response.data);
  }
};
