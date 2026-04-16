import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollow } from "@/service/service";

export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFollow,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["follow", variables.profileId],
      });
    },
  });
};