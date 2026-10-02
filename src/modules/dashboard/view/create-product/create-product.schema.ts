import { productSchema } from "@/modules/dashboard/schemas/catalog.schema";

/** name, description, slug e subCategorieId são obrigatórios na API. */
export const SchemaCreateProduct = productSchema;
