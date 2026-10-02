import { z } from "zod";

export const SchemaSignIn = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Informe seu usuário ou e-mail" }),
  password: z
    .string()
    .min(1, { message: "Informe sua senha" }),
});
