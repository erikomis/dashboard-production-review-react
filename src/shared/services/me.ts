
import { user } from "../../context/authContext";
import { api } from "./api";

export const me = async () => {
  try {
    const response = await api.request<user>({
      url: "/user/me",
      method: "GET",  
      withCredentials: true,
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.request.response.data);
  }
};
