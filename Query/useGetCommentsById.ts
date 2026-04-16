
import { useQuery } from "@tanstack/react-query";
import { getCommentByPostId } from "@/service/service";

export const useGetCommentsById = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentByPostId(postId),
    enabled: !!postId,
  });
};

