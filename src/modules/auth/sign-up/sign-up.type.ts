import { z } from "zod";
import { SchemaSignUp } from "./sign-up.schema";

export type SignUp = z.infer<typeof SchemaSignUp>;
