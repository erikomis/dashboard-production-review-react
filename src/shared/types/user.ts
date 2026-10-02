export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  roles: Role[];
  active: boolean;
}

export const isAdmin = (user?: Pick<User, "roles"> | null) =>
  !!user?.roles?.some((role) => role.name === "ADMIN");
