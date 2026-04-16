
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "@/service/service";

export const useAddCommentById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addComment,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
};

