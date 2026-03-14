import { useNavigate } from "react-router-dom";
import { ForgotPasswordService } from "../services/forgot-password";
import { useForm } from "react-hook-form";
import { SchemaForgotPassword } from "./forgot-password.schema";
import { toast } from "react-toastify";
import { ForgotPassword } from "./forgot-password.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

type ForgotPasswordServiceProps = typeof ForgotPasswordService;

export const useForgotPasswordModel = (service: ForgotPasswordServiceProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPassword>({
    resolver: zodResolver(SchemaForgotPassword),
  });

  const onSubmit = async (data: ForgotPassword) => {
    try {
      await service(data.email);
      toast.success("Email enviado com sucesso.");
      setTimeout(() => {
        navigate("/reset-password");
      }, 3000);
    } catch (er) {
      const message =
        (er as AxiosError<{ message: string }>)?.response?.data?.message ||
        (er as Error).message;
      toast.error(message);
    }
  };

  return {
    handleSubmit,
    register,
    errors,
    onSubmit,
  };
};
