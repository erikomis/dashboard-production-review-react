import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStore } from "@/shared/libs/local-store";
import { sidebarCollapsedStore } from "@/shared/libs/preferences";
import { cn } from "@/shared/utils/utils";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export function LayoutDashboard({ children }: LayoutDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useLocalStore(sidebarCollapsedStore);
  const { pathname } = useLocation();

  // Ao trocar de tela, leva o foco ao conteúdo (leitores de tela anunciam a nova página)
  useEffect(() => {
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-whiten dark:bg-boxdark-2">
      <a
        href="#main-content"
        className="sr-only z-999999 rounded-md bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div
        className={cn(
          "relative flex min-h-screen flex-1 flex-col transition-[margin] duration-300",
          collapsed ? "lg:ml-20" : "lg:ml-72.5"
        )}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none focus-visible:ring-0 dark:text-bodydark">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
