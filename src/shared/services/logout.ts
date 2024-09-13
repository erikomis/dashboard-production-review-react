import { AxiosError } from "axios";
import { api } from "./api";

export const logoutService = async () => {
  try {
    await api.request({
      url: "/auth/logout",
      method: "Post",
    });

    return true;
  } catch (er) {
    const error = er as AxiosError;
    const status = error.response?.status;
    const message = error.response?.data || error.message;
    throw new Error(`Request failed with status ${status}: ${message}`);
  }
};
