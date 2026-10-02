import {
  FolderTree,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Settings,
  Tags,
  UserRound,
} from "lucide-react";

export type NavItem = {
  label: string;
  route: string;
  icon: React.ReactNode;
};

export type NavGroup = { name: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    name: "Menu",
    items: [
      { label: "Visão geral", route: "/dashboard/home", icon: <LayoutDashboard size={20} /> },
      { label: "Produtos", route: "/dashboard/products", icon: <Package size={20} /> },
      { label: "Categorias", route: "/dashboard/categories", icon: <Tags size={20} /> },
      { label: "Subcategorias", route: "/dashboard/sub-categories", icon: <FolderTree size={20} /> },
      { label: "Avaliações", route: "/dashboard/review", icon: <MessageSquareText size={20} /> },
    ],
  },
  {
    name: "Conta",
    items: [
      { label: "Meu perfil", route: "/dashboard/profile", icon: <UserRound size={20} /> },
      { label: "Configurações", route: "/dashboard/settings", icon: <Settings size={20} /> },
    ],
  },
];
