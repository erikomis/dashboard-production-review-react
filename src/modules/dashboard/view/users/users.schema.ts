import { z } from "zod";

/** Filtros da URL (`?role=&active=`); valores desconhecidos viram "todos". */
export const userFiltersSchema = z.object({
  role: z.enum(["ADMIN", "USER"]).optional().catch(undefined),
  active: z
    .enum(["true", "false"])
    .optional()
    .catch(undefined)
    .transform((value) => (value === undefined ? undefined : value === "true")),
});
