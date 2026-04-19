import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/service/service";

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
};






