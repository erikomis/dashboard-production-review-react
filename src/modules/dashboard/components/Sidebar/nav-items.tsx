import {
  Download,
  FolderTree,
  History,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Settings,
  Tags,
  UserRound,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  route: string;
  icon: React.ReactNode;
};

export type NavGroup = { name: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    name: "Geral",
    items: [{ label: "Visão geral", route: "/dashboard/home", icon: <LayoutDashboard size={20} /> }],
  },
  {
    name: "Catálogo",
    items: [
      { label: "Produtos", route: "/dashboard/products", icon: <Package size={20} /> },
      { label: "Categorias", route: "/dashboard/categories", icon: <Tags size={20} /> },
      { label: "Subcategorias", route: "/dashboard/sub-categories", icon: <FolderTree size={20} /> },
      { label: "Importar", route: "/dashboard/import", icon: <Download size={20} /> },
    ],
  },
  {
    name: "Comunidade",
    items: [
      { label: "Avaliações", route: "/dashboard/review", icon: <MessageSquareText size={20} /> },
      { label: "Usuários", route: "/dashboard/users", icon: <Users size={20} /> },
    ],
  },
  {
    name: "Sistema",
    items: [
      { label: "Atividade", route: "/dashboard/activity", icon: <History size={20} /> },
      { label: "Configurações", route: "/dashboard/settings", icon: <Settings size={20} /> },
      { label: "Meu perfil", route: "/dashboard/profile", icon: <UserRound size={20} /> },
    ],
  },
];
