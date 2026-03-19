import { z } from "zod";
import { SchemaCreateSubCategory } from "./create-sub-category.schema";

export type CreateSubCategoryValues = z.infer<typeof SchemaCreateSubCategory>;
