import { z } from "zod";
import { SLUG_PATTERN } from "@/shared/utils/slugify";

/** Campos comuns de categoria, subcategoria e produto (todos obrigatórios na API). */
export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Informe um nome com pelo menos 2 caracteres" })
  .max(255, { message: "O nome deve ter no máximo 255 caracteres" });

export const slugSchema = z
  .string()
  .trim()
  .min(1, { message: "Informe o slug" })
  .max(255, { message: "O slug deve ter no máximo 255 caracteres" })
  .regex(SLUG_PATTERN, {
    message: "Use apenas letras minúsculas, números e hífens (ex.: meu-produto)",
  });

export const descriptionSchema = (max = 255) =>
  z
    .string()
    .trim()
    .min(1, { message: "Informe a descrição" })
    .max(max, { message: `A descrição deve ter no máximo ${max} caracteres` });

/** `<select>` devolve string; converte para número e exige seleção. */
export const selectIdSchema = (message: string) =>
  z.coerce.number({ invalid_type_error: message }).int().positive({ message });

export const categorySchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema(),
});

export const subCategorySchema = categorySchema.extend({
  categorieId: selectIdSchema("Selecione a categoria"),
});

export const productSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  // colunas description são CHAR(255) no banco
  description: descriptionSchema(),
  subCategorieId: selectIdSchema("Selecione a subcategoria"),
});

export const reviewSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "O título deve ter no mínimo 3 caracteres" })
    .max(255, { message: "O título deve ter no máximo 255 caracteres" }),
  description: z
    .string()
    .trim()
    .min(3, { message: "O comentário deve ter no mínimo 3 caracteres" })
    .max(255, { message: "O comentário deve ter no máximo 255 caracteres" }),
  note: z.coerce
    .number({ invalid_type_error: "Selecione uma nota" })
    .int()
    .min(1, { message: "Selecione uma nota de 1 a 5" })
    .max(5, { message: "A nota máxima é 5" }),
  productId: selectIdSchema("Selecione o produto"),
});
