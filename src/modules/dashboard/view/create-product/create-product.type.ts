import { z } from "zod";
import { SchemaCreateProduct } from "./create-product.schema";

export type CreateProductValues = z.infer<typeof SchemaCreateProduct>;
