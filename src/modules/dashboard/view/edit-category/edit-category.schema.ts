import { z } from "zod";

export const SchemaEditCategory = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
    .max(255, { message: "O nome deve ter no máximo 255 caracteres" }),
  description: z
    .string()
    .max(255, { message: "A descrição deve ter no máximo 255 caracteres" })
    .optional(),
});
