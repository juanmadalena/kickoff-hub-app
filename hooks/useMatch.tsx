import { useQuery } from "@tanstack/react-query";

import { api } from "@/config/api";
import { MatchResponse } from "@/interfaces";

const getMatchById = async (id: string): Promise<MatchResponse> => {
    const { data } = await api.get(`/matches/${id}`);
    return data;
}

export const useMatch = (id: string) => {
    const matchQuery = useQuery({
        queryKey: ['matches/[id]', id],
        queryFn: () => getMatchById(id),
    });

    return {
        matchQuery
    }
}

