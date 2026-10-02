import { Navigate } from "react-router-dom";
import { useMeQuery } from "./shared/hooks/useMeQuery";
import { Loading } from "./shared/components/loading/Loading";
import { isAdmin } from "./shared/types/user";
import { AccessRestrictedView } from "./shared/view/AccessRestrictedView";

type ProtectRouterProps = { children: React.ReactNode };

export const ProtectedRouter = ({ children }: ProtectRouterProps) => {
  const { data: user, isPending, isError } = useMeQuery();

  if (isPending) {
    return <Loading label="Verificando sua sessão..." />;
  }

  if (isError || !user) {
    return <Navigate to="/" replace />;
  }

  // O dashboard é só para administradores: evita telas quebrando com 403.
  if (!isAdmin(user)) {
    return <AccessRestrictedView userName={user.name} />;
  }

  return <>{children}</>;
};
