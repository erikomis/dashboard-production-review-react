import { SchemaSignUp } from "@/modules/auth/sign-up/sign-up.schema";
import { SchemaResetPassword } from "@/modules/auth/reset-password/reset-password.schema";
import { PASSWORD_POLICY_MESSAGE, passwordPolicySchema } from "./password-policy";

const errorOf = (value: string) => {
  const result = passwordPolicySchema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
};

describe("política de senha (igual à API)", () => {
  it("aceita de 8 a 72 caracteres com letras e números", () => {
    expect(errorOf("senha123")).toBeNull();
    expect(errorOf("Ação2026")).toBeNull();
    expect(errorOf("a1".repeat(36))).toBeNull();
  });

  it("recusa curtas, longas, só letras ou só números com a mesma mensagem da API", () => {
    for (const value of ["abc123", "a1".repeat(36) + "x", "somenteletras", "12345678"]) {
      expect(errorOf(value)).toBe(PASSWORD_POLICY_MESSAGE);
    }
    expect(PASSWORD_POLICY_MESSAGE).toBe("A senha deve ter de 8 a 72 caracteres, com letras e números");
  });

  it("vale no cadastro e na redefinição", () => {
    const base = { name: "Maria Silva", email: "maria@exemplo.com", username: "maria" };
    expect(SchemaSignUp.safeParse({ ...base, password: "abc", passwordConfirm: "abc" }).success).toBe(false);
    expect(SchemaSignUp.safeParse({ ...base, password: "senha123", passwordConfirm: "senha123" }).success).toBe(true);
    const reset = { email: "maria@exemplo.com", recoveryCode: "123456" };
    expect(SchemaResetPassword.safeParse({ ...reset, password: "12345678", passwordConfirm: "12345678" }).success).toBe(false);
    expect(SchemaResetPassword.safeParse({ ...reset, password: "nova1234", passwordConfirm: "nova1234" }).success).toBe(true);
  });
});
