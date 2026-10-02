import { Moon, Sun } from "lucide-react";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { Card } from "@/modules/dashboard/components/card/Card";
import { cn } from "@/shared/utils/utils";
import { useSettingsModel } from "./settings.model";

type SettingsViewProps = ReturnType<typeof useSettingsModel>;

type ToggleProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const Toggle = ({ id, label, description, checked, onChange }: ToggleProps) => (
  <div className="flex items-start justify-between gap-6">
    <div>
      <p id={`${id}-label`} className="font-medium text-black dark:text-white">{label}</p>
      <p id={`${id}-desc`} className="mt-0.5 text-sm text-body dark:text-bodydark">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={`${id}-label`}
      aria-describedby={`${id}-desc`}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-stroke dark:bg-strokedark"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5"
        )}
      />
    </button>
  </div>
);

export const SettingsView = ({
  colorMode,
  setColorMode,
  notificationToasts,
  setNotificationToasts,
  sidebarCollapsed,
  setSidebarCollapsed,
}: SettingsViewProps) => {
  const themes = [
    { value: "light" as const, label: "Claro", icon: <Sun size={20} aria-hidden="true" /> },
    { value: "dark" as const, label: "Escuro", icon: <Moon size={20} aria-hidden="true" /> },
  ];

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Preferências do painel. Ficam salvas apenas neste navegador."
        breadcrumbs={[{ label: "Configurações" }]}
      />
      <div className="grid max-w-3xl gap-6">
        <Card title="Aparência" titleId="settings-appearance">
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-black dark:text-white">Tema</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {themes.map((theme) => (
                <label
                  key={theme.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary",
                    colorMode === theme.value
                      ? "border-primary bg-primary/5 text-primary dark:bg-primary/15 dark:text-primary-light"
                      : "border-stroke text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                  )}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={colorMode === theme.value}
                    onChange={() => setColorMode(theme.value)}
                    className="sr-only"
                  />
                  {theme.icon}
                  <span className="font-medium">{theme.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-6 border-t border-stroke pt-6 dark:border-strokedark">
            <Toggle
              id="sidebar-collapsed"
              label="Menu lateral recolhido"
              description="Mostra apenas os ícones no menu lateral em telas grandes."
              checked={sidebarCollapsed}
              onChange={setSidebarCollapsed}
            />
          </div>
        </Card>

        <Card title="Notificações" titleId="settings-notifications">
          <Toggle
            id="notification-toasts"
            label="Avisos de novas avaliações"
            description="Exibe um aviso no canto da tela quando uma avaliação é criada (o sino continua registrando)."
            checked={notificationToasts}
            onChange={setNotificationToasts}
          />
        </Card>
      </div>
    </>
  );
};
