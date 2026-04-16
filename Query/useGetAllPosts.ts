import { useQuery } from "@tanstack/react-query";
import {getAllPosts} from "@/service/service";
export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
};

