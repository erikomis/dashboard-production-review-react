import { User } from "@/shared/types/user";
import { api } from "./api";

export const me = async () => {
  const response = await api.request<User>({
    url: "/user/me",
    method: "GET",
  });
  return response.data;
};
