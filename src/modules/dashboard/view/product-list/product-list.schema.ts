import { z } from "zod";
import { getProductSort } from "@/modules/dashboard/utils/product-sort";

const optionalId = z.coerce.number().int().positive().optional().catch(undefined);

/** Filtros lidos da URL (`?category=&sub=&order=`): valores inválidos são ignorados. */
export const productListFiltersSchema = z.object({
  categoryId: optionalId,
  subCategorieId: optionalId,
  order: z
    .string()
    .optional()
    .transform((value) => getProductSort(value).value),
});
