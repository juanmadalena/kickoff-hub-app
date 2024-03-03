import { api } from "@/config/api";
import { UserDataResponse } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";


const getPlayerDetailsById = async (id: string): Promise<UserDataResponse> => {
    const { data } =  await api.get(`/user/${id}`);
    return data;
}

export const usePlayerDetails = (id: string) => {

    const playerDetailsQuery = useQuery({
        queryKey: ['users/[id]', id],
        queryFn: () => getPlayerDetailsById(id),
        staleTime: 1000 * 60 * 5, // 5 minutes,
    });

    return {
        playerDetailsQuery
    }
}