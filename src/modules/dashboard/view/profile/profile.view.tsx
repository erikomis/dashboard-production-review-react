import { AtSign, CircleCheck, CircleX, KeyRound, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { Card } from "@/modules/dashboard/components/card/Card";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Skeleton } from "@/shared/components/skeleton";
import { initials } from "@/shared/utils/format";
import { useProfileModel } from "./profile.model";

type ProfileViewProps = ReturnType<typeof useProfileModel>;

const InfoItem = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
    >
      {icon}
    </span>
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-body dark:text-bodydark">{label}</dt>
      <dd className="mt-0.5 break-words font-medium text-black dark:text-white">{children}</dd>
    </div>
  </div>
);

export const ProfileView = ({ data, permissions, isLoading, isError, refetch, logout, isLoggingOut }: ProfileViewProps) => {
  return (
    <>
      <PageHeader
        title="Meu perfil"
        description="Dados da sua conta. Para alterá-los, fale com o responsável pelo sistema."
        breadcrumbs={[{ label: "Meu perfil" }]}
      />

      {isLoading ? (
        <div role="status" aria-label="Carregando perfil" className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
          <ErrorState title="Não foi possível carregar seu perfil" onRetry={refetch} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <section
            aria-label="Resumo da conta"
            className="flex flex-col items-center rounded-xl border border-stroke bg-white p-8 text-center shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <span
              aria-hidden="true"
              className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white"
            >
              {initials(data.name)}
            </span>
            <h2 className="mt-4 text-xl font-semibold text-black dark:text-white">{data.name}</h2>
            <p className="text-sm text-body dark:text-bodydark">@{data.username}</p>
            <Badge color={data.active ? "success" : "danger"} className="mt-3">
              {data.active ? <CircleCheck size={14} aria-hidden="true" /> : <CircleX size={14} aria-hidden="true" />}
              {data.active ? "Conta ativa" : "Conta inativa"}
            </Badge>
            <Button
              color="outline"
              className="mt-6 w-full"
              onClick={logout}
              isLoading={isLoggingOut}
              leftIcon={<LogOut size={18} aria-hidden="true" />}
            >
              Sair da conta
            </Button>
          </section>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card title="Informações pessoais" titleId="profile-info">
              <dl className="grid gap-6 sm:grid-cols-2">
                <InfoItem icon={<UserRound size={18} />} label="Nome completo">{data.name}</InfoItem>
                <InfoItem icon={<Mail size={18} />} label="E-mail">{data.email}</InfoItem>
                <InfoItem icon={<AtSign size={18} />} label="Usuário">@{data.username}</InfoItem>
                <InfoItem icon={<ShieldCheck size={18} />} label="Perfis de acesso">
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    {data.roles.map((role) => (
                      <Badge key={role.id} color={role.name === "ADMIN" ? "primary" : "neutral"}>
                        {role.name}
                      </Badge>
                    ))}
                  </span>
                </InfoItem>
              </dl>
            </Card>

            <Card
              title="Permissões"
              titleId="profile-permissions"
              description="Concedidas pelos seus perfis de acesso."
            >
              {permissions.length === 0 ? (
                <p className="text-sm text-body dark:text-bodydark">Nenhuma permissão atribuída.</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {permissions.map((permission) => (
                    <li key={permission}>
                      <Badge color="neutral" className="px-3 py-1">
                        <KeyRound size={12} aria-hidden="true" />
                        {permission}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
