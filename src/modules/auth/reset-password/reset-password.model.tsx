import { useForm } from "react-hook-form";
import { ResetPasswordService } from "../services/reset-password";
import { ResetPassword } from "./reset-password.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaResetPassword } from "./reset-password.schema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type ResetPasswordService = typeof ResetPasswordService;

export const useResetPasswordModel = (service: ResetPasswordService) => {
  const [errosResponse, setErrorsResponse] = useState<string>("");
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ResetPassword>({
    resolver: zodResolver(SchemaResetPassword),
  });

  const onSubmit = async ({ email, password, recoveryCode }: ResetPassword) => {
    try {
      const response = await service(email, password, recoveryCode);

      if (response.status !== 204) {
        setErrorsResponse(response.data.message);
      }
      toast.success("Senha alterada com sucesso.");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (er) {
      setErrorsResponse((er as Error).message);
    }
  };
  return {
    errosResponse,
    register,
    errors,
    handleSubmit,
    onSubmit,
  };
};
