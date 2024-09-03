import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpService } from "../services/sign-up";

const SchemaSignUp = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nome precisa ter no minimo 3 caracteres" }),
    email: z.string().email({ message: "Email invalido" }),
    username: z
      .string()
      .min(3, { message: "Username precisa ter no minimo 3 caracteres" })
      .refine((data) => data.includes("@"), {
        message: "Username invalido",
      }),
    password: z
      .string()
      .min(6, { message: "Password precisa ter no minimo 6 caracteres" }),
    passwordConfirm: z
      .string()
      .min(6, { message: "Password precisa ter no minimo 6 caracteres" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password e Password Confirm devem ser iguais",
    path: ["password", "passwpordConfirm"],
  });

type SchemaSignUp = z.infer<typeof SchemaSignUp>;
export const SignUpViewModel = () => {
  const [errosResponse, setErrosResponse] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaSignUp>({
    resolver: zodResolver(SchemaSignUp),
  });

  const onSubmit: SubmitHandler<SchemaSignUp> = async (data) => {
    // Call the service to sign up
    const response = await SignUpService(
      data.name,
      data.email,
      data.username,
      data.password
    );

    if (response?.error) {
      setErrosResponse(response.error);
    }
  };

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
    errosResponse,
  };
};
