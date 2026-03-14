import { z } from "zod";
import { CreateSubCategorieCategorieSchema } from "./create-sub-categorie.schema";

export type CreateSubCategorie = z.infer<typeof CreateSubCategorieCategorieSchema>;
