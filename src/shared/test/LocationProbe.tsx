import { useLocation } from "react-router-dom";

/** Mostra a rota atual (para os testes conferirem a navegação). */
export const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location">{location.pathname + location.search}</output>;
};
