import { z } from "zod";
import { activityPeriodSchema } from "./activity.schema";

export type ActivityPeriod = z.infer<typeof activityPeriodSchema>;

/** Período padrão da tela, em dias. */
export const DEFAULT_ACTIVITY_DAYS = 30;
export const ACTIVITY_PAGE_SIZE = 20;
