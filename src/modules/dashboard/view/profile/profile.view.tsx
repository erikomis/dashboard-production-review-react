import { User, Mail, ShieldCheck, CircleCheck, CircleX } from "lucide-react";
import { useProfileModel } from "./profile.model";

type ProfileViewProps = ReturnType<typeof useProfileModel>;

export const ProfileView = ({ data, isLoading }: ProfileViewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-gray-500">Carregando perfil...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-black dark:text-white">Meu Perfil</h2>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Avatar + nome */}
        <div className="flex flex-col items-center gap-4 px-6 py-10 border-b border-stroke dark:border-strokedark">
          <img
            src={`https://ui-avatars.com/api/?name=${data?.name}&background=3C50E0&color=fff&size=128`}
            alt={data?.name}
            className="w-24 h-24 rounded-full"
          />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-black dark:text-white">{data?.name}</h3>
            <p className="text-sm text-gray-500">@{data?.username}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              data?.active
                ? "bg-success bg-opacity-10 text-success"
                : "bg-danger bg-opacity-10 text-danger"
            }`}
          >
            {data?.active ? (
              <>
                <CircleCheck size={14} /> Conta ativa
              </>
            ) : (
              <>
                <CircleX size={14} /> Conta inativa
              </>
            )}
          </span>
        </div>

        {/* Informações */}
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
          <div className="flex items-center gap-4 px-6 py-5 border-b border-stroke dark:border-strokedark sm:border-r">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <User size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nome completo</p>
              <p className="font-medium text-black dark:text-white">{data?.name ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5 border-b border-stroke dark:border-strokedark">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <Mail size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">E-mail</p>
              <p className="font-medium text-black dark:text-white">{data?.email ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5 border-b border-stroke dark:border-strokedark sm:border-r sm:border-b-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <User size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Usuário</p>
              <p className="font-medium text-black dark:text-white">@{data?.username ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 shrink-0">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Perfis de acesso</p>
              <div className="flex flex-wrap gap-1.5">
                {data?.roles?.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex rounded-full bg-primary bg-opacity-10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
