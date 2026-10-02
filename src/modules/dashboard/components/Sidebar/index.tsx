import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, MessageSquareText, X } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import SidebarItem from "./SidebarItem";
import { navGroups } from "./nav-items";

interface SidebarProps {
  /** Mobile: gaveta aberta/fechada. */
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  /** Desktop: recolhida (só ícones). */
  collapsed: boolean;
  setCollapsed: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }: SidebarProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Mobile: Esc fecha a gaveta; ao abrir, o foco vai para o botão de fechar.
  useEffect(() => {
    if (!sidebarOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Overlay do mobile */}
      <div
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "fixed inset-0 z-9999 bg-black/50 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        id="sidebar"
        aria-label="Menu principal"
        className={cn(
          "fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col bg-black transition-[transform,width] duration-300 ease-in-out dark:bg-boxdark lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          collapsed && "lg:w-20",
          // fechada no mobile: fora da ordem de tabulação
          !sidebarOpen && "max-lg:invisible"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 px-6 py-5.5",
            collapsed && "lg:justify-center lg:px-0"
          )}
        >
          <Link
            to="/dashboard/home"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white"
            >
              <MessageSquareText size={22} />
            </span>
            <span className={cn("leading-tight", collapsed && "lg:sr-only")}>
              <span className="block text-lg font-bold text-white">Production</span>
              <span className="block text-xs font-medium uppercase tracking-widest text-bodydark">
                Review · Admin
              </span>
            </span>
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-bodydark1 hover:bg-graydark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light lg:hidden"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegação do painel" className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.name} className="mb-6">
              <h2
                className={cn(
                  "mb-3 ml-3 text-xs font-semibold uppercase tracking-wider text-bodydark",
                  collapsed && "lg:sr-only"
                )}
              >
                {group.name}
              </h2>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.route}
                    item={item}
                    collapsed={collapsed}
                    onNavigate={() => setSidebarOpen(false)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="hidden border-t border-graydark p-4 lg:block">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            aria-expanded={!collapsed}
            aria-controls="sidebar"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-bodydark1 hover:bg-graydark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:hover:bg-meta-4",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? (
              <ChevronsRight size={20} aria-hidden="true" />
            ) : (
              <>
                <ChevronsLeft size={20} aria-hidden="true" />
                Recolher menu
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
