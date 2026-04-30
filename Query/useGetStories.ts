
import { useQuery } from "@tanstack/react-query";
import { getStories} from "@/service/service"


export const useGetStories = () => {
return useQuery({
queryKey: ["stories"],
queryFn: getStories,

})


}




