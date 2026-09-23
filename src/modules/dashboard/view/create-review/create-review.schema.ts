import { z } from "zod";

export const SchemaCreateReview = z.object({
  title: z
    .string()
    .min(3, { message: "O título deve ter no mínimo 3 caracteres" })
    .max(255, { message: "O título deve ter no máximo 255 caracteres" }),
  content: z
    .string()
    .min(10, { message: "O conteúdo deve ter no mínimo 10 caracteres" })
    .max(5000, { message: "O conteúdo deve ter no máximo 5000 caracteres" }),
  rating: z
    .number()
    .int({ message: "A nota deve ser um número inteiro" })
    .min(1, { message: "Selecione uma nota" })
    .max(5, { message: "A nota máxima é 5" }),
  productId: z.string().uuid({ message: "Selecione um produto válido" }),
});
