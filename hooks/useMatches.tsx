import { useQuery } from "@tanstack/react-query";

import { api } from "@/config/api";
import { MatchesPlayedResponse, MatchesResponse } from "@/interfaces";

const getMatchesByDate = async (date: string): Promise<MatchesResponse> => {

    const { data } = await api.get(`/matches?date=${date}`);
    return data;
}

const getMatchesPlayed = async (): Promise<MatchesPlayedResponse> => {

    const { data } = await api.get(`/matches/played`);
    return data;
}

const getMatchesOrganized = async (): Promise<MatchesResponse> => {
    
    const { data } = await api.get(`/matches/organized`);
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



export const useMatchesPlayed = ( ) => {
    
        const matchesPlayedQuery = useQuery({
            queryKey: ['matches/played'],
            queryFn: () => getMatchesPlayed(),
        });
    
        return {
            matchesPlayedQuery
        }
}

export const useMatchesOrganized = ( ) => {
        
        const matchesOrganizedQuery = useQuery({
            queryKey: ['matches/organized'],
            queryFn: () => getMatchesOrganized(),
        });
    
        return {
            matchesOrganizedQuery
        }
}