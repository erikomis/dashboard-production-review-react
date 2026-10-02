import { z } from "zod";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Use uma data válida" })
  .optional()
  .or(z.literal("").transform(() => undefined));

/** Período do filtro: datas opcionais, mas a inicial não pode passar da final. */
export const activityPeriodSchema = z
  .object({ from: dateString, to: dateString })
  .refine((value) => !value.from || !value.to || value.from <= value.to, {
    message: "A data inicial deve ser igual ou anterior à final",
    path: ["to"],
  });
