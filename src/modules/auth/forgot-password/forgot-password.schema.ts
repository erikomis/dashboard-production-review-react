import { z } from "zod";

export const SchemaForgotPassword = z.object({
  email: z.string().email({ message: "Informe um e-mail válido" }),
});
