import { z } from "zod";

export const IMPORT_MIN = 1;
export const IMPORT_MAX = 30;
export const IMPORT_DEFAULT = 12;

export const importCatalogSchema = z.object({
  productsPerSubcategory: z.coerce
    .number({ invalid_type_error: "Informe um número de 1 a 30" })
    .int({ message: "Use um número inteiro" })
    .min(IMPORT_MIN, { message: `O mínimo é ${IMPORT_MIN} produto por subcategoria` })
    .max(IMPORT_MAX, { message: `O máximo é ${IMPORT_MAX} produtos por subcategoria` }),
});
