import { z } from "zod";

/** Motivo obrigatório ao ocultar (a API limita a 255 caracteres). */
export const hideReviewSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, { message: "Explique o motivo com pelo menos 3 caracteres" })
    .max(255, { message: "O motivo deve ter no máximo 255 caracteres" }),
});

const optionalPositive = z.coerce.number().int().positive().optional().catch(undefined);

/** Filtros lidos da URL; valores inválidos são descartados. */
export const reviewFiltersSchema = z.object({
  note: z.coerce.number().int().min(1).max(5).optional().catch(undefined),
  productId: optionalPositive,
});
