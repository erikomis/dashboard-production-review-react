import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useLogout } from "@/shared/hooks/useLogout";
import { initials } from "@/shared/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";

const DropdownUser = () => {
  const { data } = useMeQuery();
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-3 rounded-lg p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Menu da conta de ${data?.name ?? "usuário"}`}
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">{data?.name}</span>
          <span className="block text-xs text-body dark:text-bodydark">@{data?.username}</span>
        </span>
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
        >
          {initials(data?.name)}
        </span>
        <ChevronDown size={16} aria-hidden="true" className="hidden text-body dark:text-bodydark sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel className="font-normal">
          <span className="block font-semibold text-black dark:text-white">{data?.name}</span>
          <span className="block truncate text-xs text-body dark:text-bodydark">{data?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/dashboard/profile")}>
          <UserRound size={18} aria-hidden="true" />
          Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/dashboard/settings")}>
          <Settings size={18} aria-hidden="true" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isLoggingOut}
          onSelect={() => void logout()}
          className="data-[highlighted]:text-danger dark:data-[highlighted]:text-danger-light"
        >
          <LogOut size={18} aria-hidden="true" />
          {isLoggingOut ? "Saindo..." : "Sair"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownUser;
