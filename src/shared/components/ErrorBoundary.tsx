import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

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
        <main className="grid min-h-full px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8 dark:bg-boxdark">
          <div className="text-center">
            <p className="text-base font-semibold text-danger">Erro</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Algo deu errado
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
              {this.state.message || "Ocorreu um erro inesperado na aplicação."}
            </p>
            <div className="flex items-center justify-center mt-10 gap-x-6">
              <Link
                to="/dashboard/products"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
              >
                Voltar ao Dashboard
              </Link>
              <button
                onClick={() => this.setState({ hasError: false, message: "" })}
                className="text-sm font-semibold text-gray-900 dark:text-white"
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
