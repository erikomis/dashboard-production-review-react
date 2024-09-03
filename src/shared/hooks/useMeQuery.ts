import { useQuery } from "@tanstack/react-query";
import { me } from "../services/me";

export const useMeQuery = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => me(),
    retry: 1,
  
  });



