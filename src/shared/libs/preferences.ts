import { createLocalStore } from "./local-store";

export type ColorMode = "light" | "dark";

export const colorModeStore = createLocalStore<ColorMode>("color-theme", "light");
export const sidebarCollapsedStore = createLocalStore<boolean>("sidebar-collapsed", false);
export const notificationToastStore = createLocalStore<boolean>("notification-toasts", true);

const applyColorMode = (mode: ColorMode) => {
  const root = window.document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
};

// Aplica o tema salvo assim que o módulo carrega (evita "flash" no login)
applyColorMode(colorModeStore.get());
colorModeStore.subscribe(() => applyColorMode(colorModeStore.get()));
