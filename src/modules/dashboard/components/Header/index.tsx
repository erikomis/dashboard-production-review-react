import { Menu, Search } from "lucide-react";
import { useCommandPalette } from "@/modules/dashboard/components/command-palette";
import { shortcutLabel } from "@/modules/dashboard/components/command-palette/command-items";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = (props: { sidebarOpen: boolean; setSidebarOpen: (arg0: boolean) => void }) => {
  const palette = useCommandPalette();
  const shortcut = shortcutLabel();

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:border-strokedark dark:bg-boxdark/95 dark:supports-[backdrop-filter]:bg-boxdark/85">
      <div className="flex flex-grow items-center justify-between gap-3 px-4 py-3 md:px-6 2xl:px-11">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-controls="sidebar"
            aria-expanded={props.sidebarOpen}
            aria-label="Abrir menu"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-stroke bg-white text-black shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Busca rápida: telas, ações e produtos (Ctrl+K / ⌘+K) */}
        <div className="flex flex-1 justify-end sm:justify-start">
          <button
            type="button"
            onClick={palette.open}
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K"
            aria-label={`Busca rápida (${shortcut})`}
            className="group flex h-10 items-center gap-3 rounded-lg border border-stroke bg-gray-2 px-3 text-sm text-body transition-colors hover:border-primary/50 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-strokedark dark:bg-meta-4 dark:text-bodydark dark:hover:text-white sm:w-full sm:max-w-md"
          >
            <Search size={18} aria-hidden="true" className="shrink-0" />
            <span className="hidden flex-1 text-left sm:inline">Buscar telas, ações ou produtos...</span>
            <kbd
              aria-hidden="true"
              className="hidden rounded border border-stroke bg-white px-1.5 py-0.5 font-satoshi text-[11px] font-medium text-black shadow-sm dark:border-strokedark dark:bg-boxdark dark:text-bodydark1 sm:inline"
            >
              {shortcut}
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-5">
          <ul className="flex items-center gap-3 2xsm:gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
