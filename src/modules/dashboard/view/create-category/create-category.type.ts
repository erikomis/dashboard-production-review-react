import { z } from "zod";
import { SchemaCreateCategory } from "./create-category.schema";

export type CreateCategoryValues = z.infer<typeof SchemaCreateCategory>;
