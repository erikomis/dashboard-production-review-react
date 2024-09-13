import { z } from "zod";

export const SchemaSignIn = z.object({
  username: z
    .string()
    .min(3, { message: "Username  precisa ter no minimo 3 caracteres" }),
  password: z
    .string()
    .min(6, { message: "Password precisa ter no minimo 6 caracteres" }),
});
