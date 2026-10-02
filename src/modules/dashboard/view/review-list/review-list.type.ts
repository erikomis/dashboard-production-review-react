import { z } from "zod";
import { hideReviewSchema } from "./review-list.schema";

export type HideReviewValues = z.infer<typeof hideReviewSchema>;

export type ModerationTarget = { id: number; title: string; action: "hide" | "restore" };
