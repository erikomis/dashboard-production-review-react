import { useForm } from "react-hook-form";
import { ResetPasswordService } from "../services/reset-password";
import { ResetPassword } from "./reset-password.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaResetPassword } from "./reset-password.schema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const response = await service(email, password, recoveryCode);

    if (response.status !== 200) {
      setErrorsResponse(response.data.message);
    }
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return {
    errosResponse,
    register,
    errors,
    handleSubmit,
    onSubmit,
  };
};
