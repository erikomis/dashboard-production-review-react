import { useEffect, useState } from "react";
import { ActivateAccountService } from "../services/activateAccount";
import { useNavigate, useParams } from "react-router-dom";

type ActivateAccountServiceProps = typeof ActivateAccountService;

export const useActivateAccountModel = (
  service: ActivateAccountServiceProps
) => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setMessage("Token invalido.");
        setType("error");
        return;
      }
      try {
        const response = await service(token);
        if (response.status !== 200) {
          setMessage("Erro ao ativar a conta. Por favor, tente novamente.");
          setType("error");
          setTimeout(() => {
            navigate("/");
          }, 3000);
          return;
        }
        setMessage("Conta ativada com sucesso.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch {
        setMessage("Erro ao ativar a conta. Por favor, tente novamente.");
        setType("error");
        setTimeout(() => {
          navigate("/");
        }, 6000);
      }
    };
    activateAccount();
  }, [token, navigate, service]);

  return {
    message,
    type,
  };
};
