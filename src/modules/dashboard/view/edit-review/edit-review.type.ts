import { z } from "zod";
import { SchemaEditReview } from "./edit-review.schema";

export type EditReviewValues = z.infer<typeof SchemaEditReview>;
