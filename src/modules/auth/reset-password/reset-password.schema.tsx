import { z } from "zod";
import { passwordPolicySchema } from "@/shared/utils/password-policy";

export const SchemaResetPassword = z
  .object({
    email: z.string().email({ message: "Informe um e-mail válido" }),
    // O backend envia um código de 6 dígitos (antes o schema exigia 4)
    recoveryCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, { message: "O código tem 6 dígitos" }),
    // Política da API: 8 a 72 caracteres, com letras e números
    password: passwordPolicySchema,
    passwordConfirm: z.string().min(1, { message: "Confirme a senha" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não conferem",
    path: ["passwordConfirm"],
  });
