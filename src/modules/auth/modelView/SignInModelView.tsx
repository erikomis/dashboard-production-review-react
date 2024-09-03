import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationUser } from "../hooks/useMutationUser";
type SignInValues = {
  username: string;
  password: string;
};

const SchemaSignIn = z.object({
  username: z
    .string()
    .min(3, { message: "Username  precisa ter no minimo 3 caracteres" }),
  password: z
    .string()
    .min(6, { message: "Password precisa ter no minimo 6 caracteres" }),
});
export const SignInModelView = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(SchemaSignIn),
  });
  const { mutateAsync: SignInService, error } = useMutationUser();
  const onSubmit: SubmitHandler<SignInValues> = async (data) => {
    try {
      const response = await SignInService(data);
      
      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch {
      console.log(error);

      toast.error(error?.message);
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
