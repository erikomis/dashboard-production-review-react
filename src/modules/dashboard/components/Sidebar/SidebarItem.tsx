import { NavLink } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { NavItem } from "./nav-items";

type SidebarItemProps = {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
};

/**
 * Item de navegação. `NavLink` marca `aria-current="page"` e fica ativo também
 * nas sub-rotas (ex.: /dashboard/products/add mantém "Produtos" ativo).
 */
const SidebarItem = ({ item, collapsed, onNavigate }: SidebarItemProps) => (
  <li>
    <NavLink
      to={item.route}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-bodydark1 transition-colors hover:bg-graydark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:hover:bg-meta-4",
          collapsed && "lg:justify-center lg:px-0",
          isActive && "bg-graydark text-white dark:bg-meta-4"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-primary-light"
            />
          )}
          <span aria-hidden="true" className="shrink-0">
            {item.icon}
          </span>
          <span className={cn(collapsed && "lg:sr-only")}>{item.label}</span>
        </>
      )}
    </NavLink>
  </li>
);

export default SidebarItem;
