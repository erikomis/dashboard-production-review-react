import { z } from "zod";
import { SchemaForgotPassword } from "./forgot-password.schema";

export type ForgotPassword = z.infer<typeof SchemaForgotPassword>;