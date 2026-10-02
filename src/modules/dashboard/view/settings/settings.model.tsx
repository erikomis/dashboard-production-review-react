import { useLocalStore } from "@/shared/libs/local-store";
import {
  ColorMode,
  colorModeStore,
  notificationToastStore,
  sidebarCollapsedStore,
} from "@/shared/libs/preferences";

/** Preferências locais do painel (salvas neste navegador). */
export const useSettingsModel = () => {
  const [colorMode, setColorMode] = useLocalStore(colorModeStore);
  const [notificationToasts, setNotificationToasts] = useLocalStore(notificationToastStore);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStore(sidebarCollapsedStore);

  return {
    colorMode,
    setColorMode: (mode: ColorMode) => setColorMode(mode),
    notificationToasts,
    setNotificationToasts,
    sidebarCollapsed,
    setSidebarCollapsed,
  };
};
