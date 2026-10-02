import { z } from "zod";
import { PERIOD_OPTIONS } from "@/modules/dashboard/utils/chart-data";

/** `?days=` da URL: só 7, 30 ou 90; qualquer outra coisa cai em 30. */
export const homePeriodSchema = z.coerce
  .number()
  .refine((value) => (PERIOD_OPTIONS as readonly number[]).includes(value))
  .catch(30);
