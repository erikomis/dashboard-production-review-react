import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useLogout } from "@/shared/hooks/useLogout";

export const useProfileModel = () => {
  const { data, isLoading, isError, refetch } = useMeQuery();
  const { logout, isLoggingOut } = useLogout();

  // Permissões únicas de todas as roles (ex.: READ_PRIVILEGES)
  const permissions = [
    ...new Set(data?.roles.flatMap((role) => role.permissions.map((p) => p.name)) ?? []),
  ].sort();

  return {
    data,
    permissions,
    isLoading,
    isError,
    refetch: () => void refetch(),
    logout,
    isLoggingOut,
  };
};
