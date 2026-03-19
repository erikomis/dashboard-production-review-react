import { z } from "zod";

export const SchemaCreateProduct = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
    .max(255, { message: "O nome deve ter no máximo 255 caracteres" }),
  description: z
    .string()
    .min(10, { message: "A descrição deve ter no mínimo 10 caracteres" })
    .max(5000, { message: "A descrição deve ter no máximo 5000 caracteres" }),
});
