"use client";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/service/service";


export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
