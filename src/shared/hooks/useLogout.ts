import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { queryClient } from "@/shared/libs/react-query";
import { logoutService } from "@/shared/services/logout";
import { getErrorMessage } from "@/shared/utils/error-message";

export const useLogout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutService();
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível encerrar a sessão."));
      setIsLoggingOut(false);
      return;
    }
    // Remove o cache (inclusive "me") antes de navegar; senão RouterAuth
    // ainda veria o usuário logado e mandaria de volta para o dashboard.
    queryClient.removeQueries();
    navigate("/", { replace: true });
  };

  return { logout, isLoggingOut };
};
