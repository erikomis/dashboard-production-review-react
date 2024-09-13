import { Navigate } from "react-router-dom";
import { useMeQuery } from "./shared/hooks/useMeQuery";
import { Loading } from "./shared/components/loading/Loading";

type ProtectRouterProps = { children: React.ReactNode };

export const ProtectedRouter = ({ children }: ProtectRouterProps) => {
  const { isLoading, isSuccess } = useMeQuery();
  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!isSuccess) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
