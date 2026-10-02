import { Outlet } from "react-router-dom";
import { BrandMark } from "@/shared/components/svgs/BrandMark";
import { Logo } from "@/shared/components/svgs/Logo";

export const LayoutAuth = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-whiten px-4 py-8 dark:bg-boxdark-2">
      <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-stretch">
          <div className="hidden w-full bg-gray-2 dark:bg-meta-4/40 xl:flex xl:w-1/2 xl:items-center xl:justify-center">
            <div className="px-16 py-17.5 text-center">
              <p className="flex items-center justify-center gap-3 font-display text-2xl font-bold text-black dark:text-white">
                <BrandMark />
                ReviewStore
              </p>
              <p className="mt-2 text-body dark:text-bodydark">
                Painel administrativo do catálogo e das avaliações.
              </p>
              <span className="mt-12 inline-block" aria-hidden="true">
                <Logo />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l">
            <div className="flex items-center gap-3 px-6 pt-8 sm:px-12.5 xl:hidden">
              <BrandMark />
              <span className="font-display font-bold text-black dark:text-white">ReviewStore · Admin</span>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};
