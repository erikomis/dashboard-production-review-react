import { api } from "./api";

type role = {
  id: number;
  name: string;
  permissions: [
    {
      id: number;
      name: string;
    }
  ];
};

type user = {
  id: number;
  name: string;
  email: string;
  username: string;
  roles: role[];
  active: boolean;
};
export const me = async () => {
  try {
    const response = await api.request<user>({
      url: "/user/me",
      method: "GET",
      withCredentials: true,
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.request.response.data);
  }
};
