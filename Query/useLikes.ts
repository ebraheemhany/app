import { useQuery } from "@tanstack/react-query";
import { getLikesByPostId } from "@/service/service";

export const useLikes = (postId: string, userId?: string) => {
  return useQuery({
    queryKey: ["likes", postId, userId ?? "guest"],
    queryFn: () => getLikesByPostId(postId, userId),
    enabled: !!postId,
  });
};