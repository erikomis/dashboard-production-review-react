import { Navigate } from "react-router-dom";
import { useMeQuery } from "./shared/hooks/useMeQuery";

type ProtectRouterProps = { children: React.ReactNode };

export const ProtedRouter = ({ children }: ProtectRouterProps) => {
  const { data, isLoading, error } = useMeQuery();

  if (isLoading) {
    return (
      <div className="flex items-center w-full">
        <div className="flex items-center justify-center w-full h-screen">
          <div className="w-32 h-32 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!data?.id && !isLoading && error?.message) {
    localStorage.clear();
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
