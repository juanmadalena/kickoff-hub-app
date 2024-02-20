import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/config/api";
import { PlayersResponse } from "@/interfaces";

const getPlayersByMatchId = async (id: string): Promise<PlayersResponse> => {
    console.log("fetching players");
    const { data } = await api.get(`/matches/players/${id}`);
    return data;
}

const joinMatch = async (idMatch: string, idUser: string) => {
    const { data } =  await api.post(`/matches/join/`, {idMatch, idUser, position:'GK'});
    console.log("joined", data);
    return data;
}

const leaveMatch = async (idMatch: string, idUser: string) => {
    const { data } =  await api.post(`/matches/leave/`, {idMatch, idUser});
    return data;
}

export const usePlayers = (id: string) => {
    const playersQuery = useQuery({
        queryKey: ['matches/players/[id]', id],
        queryFn: () => getPlayersByMatchId(id),
    });

    return {
        playersQuery
    }
}

export const useJoinMatch = (idMatch: string, idUser: string) => {
    const joinMatchQuery = useMutation({
        mutationKey: ['join', idMatch],
        mutationFn: () => joinMatch(idMatch, idUser),
    });

    return{
        joinMatchQuery
    }
}