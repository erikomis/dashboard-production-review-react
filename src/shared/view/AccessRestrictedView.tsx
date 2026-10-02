import { LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/button";
import { useLogout } from "@/shared/hooks/useLogout";

type AccessRestrictedViewProps = { userName?: string };

/** Exibida quando o usuário logado não tem a role ADMIN. */
export const AccessRestrictedView = ({ userName }: AccessRestrictedViewProps) => {
  const { logout, isLoggingOut } = useLogout();

  return (
    <main className="grid min-h-screen place-items-center bg-whiten px-4 py-16 dark:bg-boxdark-2">
      <div className="w-full max-w-lg rounded-xl border border-stroke bg-white p-8 text-center shadow-default dark:border-strokedark dark:bg-boxdark sm:p-10">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning-dark dark:bg-warning/20 dark:text-warning">
          <ShieldAlert size={32} aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold text-black dark:text-white">Acesso restrito</h1>
        <p className="mt-3 text-body dark:text-bodydark">
          {userName ? <>Olá, <strong className="text-black dark:text-white">{userName}</strong>. </> : null}
          Este painel é exclusivo para administradores. Sua conta não tem a
          permissão <strong className="text-black dark:text-white">ADMIN</strong>.
        </p>
        <p className="mt-2 text-sm text-body dark:text-bodydark">
          Se você acredita que isso é um engano, peça acesso a um administrador e
          entre novamente.
        </p>
        <Button
          className="mt-8 w-full sm:w-auto"
          onClick={logout}
          isLoading={isLoggingOut}
          leftIcon={<LogOut size={18} aria-hidden="true" />}
        >
          Sair e entrar com outra conta
        </Button>
      </div>
    </main>
  );
};
