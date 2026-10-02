import { SignUpService } from "../services/sign-up";
import { SignUp } from "./sign-up.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { SchemaSignUp } from "./sign-up.schema";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/shared/utils/error-message";
import { toast } from "react-toastify";

type SignUpServiceProps = typeof SignUpService;

export const useSignUpModel = (SignUpService: SignUpServiceProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUp>({
    resolver: zodResolver(SchemaSignUp),
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    try {
      const response = await SignUpService(
        data.name,
        data.email,
        data.username,
        data.password
      );

      if (response.status === 201) {
        toast.success("Conta criada! Enviamos um e-mail para você ativar a conta antes de entrar.");
        navigate("/");
      }
    } catch (er) {
      // 409 usuário/e-mail já existe
      toast.error(getErrorMessage(er, "Não foi possível criar a conta."));
    }
  };

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
    isSubmitting,
  };
};
