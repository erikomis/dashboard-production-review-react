import { z } from "zod";

export const CreateSubCategorieCategorieSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "O nome da categoria deve ter no mínimo 3 caracteres",
    })
    .max(255, {
      message: "O nome da categoria deve ter no máximo 255 caracteres",
    }),
  description: z
    .string()
    .min(3, {
      message: "A descrição da categoria deve ter no mínimo 3 caracteres",
    })
    .max(255, {
      message: "A descrição da categoria deve ter no máximo 255 caracteres",
    }),
  slug: z
    .string()
    .min(3, { message: "O slug da categoria deve ter no mínimo 3 caracteres" })
    .max(255, {
      message: "O slug da categoria deve ter no máximo 255 caracteres",
    }),
  categorieId: z.string().min(
    1,
    { message: "A categoria deve ser selecionada" }
  ).trim(),
});
