import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Fica acima do BrowserRouter, então não pode usar <Link> (lançaria outro erro
 * por estar fora do Router); usa <a> normal.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary capturou:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          className="grid min-h-screen place-items-center bg-whiten px-6 py-24 dark:bg-boxdark-2"
        >
          <div className="max-w-lg text-center">
            <p className="text-base font-semibold text-danger dark:text-danger-light">Erro</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Algo deu errado
            </h1>
            <p className="mt-6 text-base text-body dark:text-bodydark">
              {this.state.message || "Ocorreu um erro inesperado na aplicação."}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/dashboard/home"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Voltar ao Dashboard
              </a>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, message: "" })}
                className="rounded-md px-2 py-1 text-sm font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white"
              >
                Tentar novamente →
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
