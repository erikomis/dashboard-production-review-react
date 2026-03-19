import { z } from "zod";
import { SchemaCreateReview } from "./create-review.schema";

export type CreateReviewValues = z.infer<typeof SchemaCreateReview>;
