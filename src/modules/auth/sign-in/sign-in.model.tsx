import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutationUser } from "../hooks/useMutationUser";
import { SchemaSignIn } from "./sign-in.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInValues } from "./sign-in.type";
import { SignInService } from "../services/sign-in";

type SignInServiceProps = typeof SignInService;
export const useSignInModel = (SignInService: SignInServiceProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(SchemaSignIn),
  });
  const { mutateAsync: signIN, error } = useMutationUser({
    service: SignInService,
  });
  const onSubmit: SubmitHandler<SignInValues> = async (data) => {
    try {
      await signIN(data);

      navigate("/dashboard/");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
    error,
  };
};
