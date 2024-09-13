import { AxiosError } from "axios";
import { api } from "../../../shared/services/api";

export  const ResetPasswordService = async (email: string, password:string, recoveryCode:string) => {


    try {
        const response = await api.request({
            url: "/auth/recovery-code/password",
            method: "PATCH",
            data: {
                email,
                password,
                recoveryCode
            },
        });
        return response;
    } catch (er) {
        const error = er as AxiosError;
        const status = error.response?.status;
        const message = error.response?.data || error.message;
        throw new Error(`Request failed with status ${status}: ${message}`);
    }
};