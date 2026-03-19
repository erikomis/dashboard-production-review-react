import { z } from "zod";
import { SchemaEditProduct } from "./edit-product.schema";

export type EditProductValues = z.infer<typeof SchemaEditProduct>;
