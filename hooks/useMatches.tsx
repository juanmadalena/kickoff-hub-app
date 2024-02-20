import { useQuery } from "@tanstack/react-query";

import { api } from "@/config/api";
import { MatchesResponse } from "@/interfaces";

const getMatchesByDate = async (date: string): Promise<MatchesResponse> => {
    const { data } = await api.get(`/matches?date=${date}`);
    return data;
}

export const useMatches = (date: string) => {
    const matchesQuery = useQuery({
        queryKey: ['matches', date],
        queryFn: () => getMatchesByDate(date),
    });

    return {
        matchesQuery
    }
}

