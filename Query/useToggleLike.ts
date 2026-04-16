import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type ToggleLikeParams = {
  postId: string;
  userId: string;
  liked: boolean;
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId, liked }: ToggleLikeParams) => {
      if (liked) {
        return await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
      }

      return await supabase
        .from("likes")
        .insert({
          post_id: postId,
          user_id: userId,
        });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["likes", variables.postId, variables.userId],
      });
    },
  });
};