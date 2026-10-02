import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { LocationProbe } from "./LocationProbe";

/** Renderiza com React Query (sem retry) e roteador em memória. */
export const renderWithProviders = (
  ui: React.ReactElement,
  { route = "/dashboard/home", ...options }: RenderOptions & { route?: string } = {}
) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
    options
  );
};
