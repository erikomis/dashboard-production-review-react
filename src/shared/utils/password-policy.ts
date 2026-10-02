import { z } from "zod";

/** Mesma regra e mesma mensagem da API (cadastro e redefinição de senha). */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;
export const PASSWORD_POLICY_MESSAGE = "A senha deve ter de 8 a 72 caracteres, com letras e números";
export const PASSWORD_HINT = "De 8 a 72 caracteres, com pelo menos uma letra e um número.";

export const passwordPolicySchema = z
  .string()
  .min(PASSWORD_MIN, { message: PASSWORD_POLICY_MESSAGE })
  .max(PASSWORD_MAX, { message: PASSWORD_POLICY_MESSAGE })
  .regex(/\p{L}/u, { message: PASSWORD_POLICY_MESSAGE })
  .regex(/\d/, { message: PASSWORD_POLICY_MESSAGE });
