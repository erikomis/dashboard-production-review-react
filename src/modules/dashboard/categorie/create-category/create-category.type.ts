import { z } from "zod";
import { CreateCategorySchema } from "./create-category.schema";

export type CreateCategorie = z.infer<typeof CreateCategorySchema>;
