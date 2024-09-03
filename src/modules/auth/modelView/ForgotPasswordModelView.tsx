import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SchemaForgotPassword = z.object({
  email: z.string().email({ message: "Email invalido" }),
});

type SchemaForgotPassword = z.infer<typeof SchemaForgotPassword>;

export const ForgotPasswordModelView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaForgotPassword>({
    resolver: zodResolver(SchemaForgotPassword),
  });

  const onSubmit = (data: SchemaForgotPassword) => {
    console.log(data);
  };

  return {
    handleSubmit,
    register,
    errors,
    onSubmit,
  };
};
