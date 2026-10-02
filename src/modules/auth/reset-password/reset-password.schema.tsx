import { z } from "zod";

export const SchemaResetPassword = z
  .object({
    email: z.string().email({ message: "Informe um e-mail válido" }),
    // O backend envia um código de 6 dígitos (antes o schema exigia 4)
    recoveryCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, { message: "O código tem 6 dígitos" }),
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
