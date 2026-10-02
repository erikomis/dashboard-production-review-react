import { reviewSchema } from "@/modules/dashboard/schemas/catalog.schema";

/** title, description, note (1–5) e productId são obrigatórios na API. */
export const SchemaCreateReview = reviewSchema;
