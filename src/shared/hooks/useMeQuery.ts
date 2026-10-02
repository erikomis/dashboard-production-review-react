import { queryOptions, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { me } from "../services/me";

export const meQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: () => me(),
  // 401/403 significam "não logado": não adianta tentar de novo.
  retry: (failureCount, error) => {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401 || status === 403) return false;
    return failureCount < 1;
  },
});

export const useMeQuery = () => useQuery(meQueryOptions);
