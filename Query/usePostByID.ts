"use client";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "@/service/service";

export const useGetPost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  });
};