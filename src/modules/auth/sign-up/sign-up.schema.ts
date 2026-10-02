import { z } from "zod";

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
    // API aceita de 3 a 20 caracteres; exigimos 6 no mínimo por segurança
    password: z
      .string()
      .min(6, { message: "A senha precisa ter no mínimo 6 caracteres" })
      .max(20, { message: "A senha pode ter no máximo 20 caracteres" }),
    passwordConfirm: z.string().min(1, { message: "Confirme a senha" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não conferem",
    path: ["passwordConfirm"],
  });
