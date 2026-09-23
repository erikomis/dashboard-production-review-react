import { z } from "zod";
import { SchemaEditSubCategory } from "./edit-sub-category.schema";

export type EditSubCategoryValues = z.infer<typeof SchemaEditSubCategory>;
