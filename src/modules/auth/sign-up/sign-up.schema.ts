import { z } from "zod";
import { passwordPolicySchema } from "@/shared/utils/password-policy";

export const SchemaSignUp = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome precisa ter no mínimo 3 caracteres" }),
    email: z.string().email({ message: "Informe um e-mail válido" }),
    username: z
      .string()
      .min(3, { message: "O usuário precisa ter no mínimo 3 caracteres" })
      .refine((data) => !data.includes("@"), {
        message: "O usuário não pode conter @",
      }),
    // Política da API: 8 a 72 caracteres, com letras e números
    password: passwordPolicySchema,
    passwordConfirm: z.string().min(1, { message: "Confirme a senha" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não conferem",
    path: ["passwordConfirm"],
  });
