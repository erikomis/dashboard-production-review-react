import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = (props: {
  sidebarOpen: boolean;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Busca global de produtos (a API suporta `search` parcial no nome)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/dashboard/products?search=${encodeURIComponent(q)}` : "/dashboard/products");
    setSearch("");
  };

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
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

        <form role="search" onSubmit={handleSearch} className="hidden flex-1 sm:block">
          <label htmlFor="global-search" className="sr-only">
            Buscar produtos
          </label>
          <div className="relative max-w-md">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body dark:text-bodydark"
            />
            <input
              id="global-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos pelo nome..."
              className="h-10 w-full rounded-lg border border-transparent bg-gray-2 pl-10 pr-4 text-sm text-black outline-none placeholder:text-body/80 focus:border-primary dark:bg-meta-4 dark:text-white dark:placeholder:text-bodydark/70"
            />
          </div>
        </form>

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
