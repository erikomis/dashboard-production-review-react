import { useMeQuery } from "@/shared/hooks/useMeQuery";

export const useProfileModel = () => {
  const { data, isLoading } = useMeQuery();

  return {
    data,
    isLoading,
  };
};
