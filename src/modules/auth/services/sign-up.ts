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

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
};
