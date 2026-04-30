import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addNewStorie } from "@/service/service"

export const useAddStories = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addNewStorie, // ✅ مش محتاج تبعت userId
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] })
    },
    onError: (error) => {
      console.error("فشل إضافة الستوري:", error)
    },
  })
}
