import { useNavigate } from "react-router-dom";
import { ForgotPasswordService } from "../services/forgot-password";
import { useForm } from "react-hook-form";
import { SchemaForgotPassword } from "./forgot-password.schema";
import { toast } from "react-toastify";
import { ForgotPassword } from "./forgot-password.type";
import { zodResolver } from "@hookform/resolvers/zod";

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
    const response = await service(data.email);

    if (response.status !== 200) {
      toast.error(response.data.message);
    }
    setTimeout(() => {
      navigate("/reset-password");
    }, 3000);
  };

  return {
    handleSubmit,
    register,
    errors,
    onSubmit,
  };
};
