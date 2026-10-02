import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

type NotFoundViewProps = {
  path: string;
  message: string;
  /** Dentro do layout do dashboard não ocupa a tela toda. */
  embedded?: boolean;
};

export const NotFoundView = ({ path, message, embedded = false }: NotFoundViewProps) => {
  const Wrapper = embedded ? "div" : "main";
  return (
    <Wrapper
      className={
        embedded
          ? "grid place-items-center px-6 py-16"
          : "grid min-h-screen place-items-center bg-whiten px-6 py-24 dark:bg-boxdark-2"
      }
    >
      <div className="text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light">
          <Compass size={32} aria-hidden="true" />
        </span>
        <p className="text-base font-semibold text-primary dark:text-primary-light">Erro 404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mt-4 text-base text-body dark:text-bodydark">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Link
            to={path}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {message}
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};
