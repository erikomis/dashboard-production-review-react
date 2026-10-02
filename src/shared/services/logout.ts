import { api } from "./api";

export const logoutService = async () => {
  await api.request({
    url: "/auth/logout",
    method: "POST",
  });
  return true;
};
