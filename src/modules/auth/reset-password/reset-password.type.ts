import { z } from "zod";
import { SchemaResetPassword } from "./reset-password.schema";

export type ResetPassword = z.infer<typeof SchemaResetPassword>;
