import { useQuery } from "@tanstack/react-query";
import { getFollowData } from "@/service/service";

export const useFollow = (profileId: string) => {
  return useQuery({
    queryKey: ["follow", profileId],
    queryFn: () => getFollowData(profileId),
    enabled: !!profileId,
  });
};