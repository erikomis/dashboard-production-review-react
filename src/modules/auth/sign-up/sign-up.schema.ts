import { z } from "zod";

export const SchemaSignUp = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nome precisa ter no minimo 3 caracteres" }),
    email: z.string().email({ message: "Email invalido" }),
    username: z
      .string()
      .min(3, { message: "Username precisa ter no minimo 3 caracteres" })
      .refine((data) => !data.includes("@"), {
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
    path: ["passwordConfirm"],
  });
