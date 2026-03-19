import { z } from "zod";
import { SchemaEditCategory } from "./edit-category.schema";

export type EditCategoryValues = z.infer<typeof SchemaEditCategory>;
