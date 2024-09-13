import { z } from "zod";

export const SchemaResetPassword = z
  .object({
    email: z.string().email({ message: "Email invalido" }),
    recoveryCode: z
      .string()
      .min(4, { message: "Recovery Code precisa ter no minimo 6 caracteres" })
      .max(4, { message: "Recovery Code precisa ter no maximo 6 caracteres" }),
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
