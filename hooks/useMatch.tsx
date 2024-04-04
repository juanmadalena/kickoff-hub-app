import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/config/api";
import { MatchResponse } from "@/interfaces";
import axios from "axios";

const getMatchById = async (id: string): Promise<MatchResponse> => {
    const { data } = await api.get(`/matches/${id}`);
    return data;
}

const createMatch = async (form: createMatchProps) => {
    const { data } = await api.post('/matches', form);
    return data;
}

export const useMatch = (id: string) => {
    const matchQuery = useQuery({
        queryKey: ['matches/[id]', id],
        queryFn: () => getMatchById(id),
        enabled: !!id,
    });

    return {
        matchQuery
    }
}

export type createMatchProps = {
    date: string | Date;
    time: string;
    location: string;
    address: string;
    idAddress: string | undefined;
    description: string;
    maxPlayers: number;
    minPlayers: number;
    duration: string;
    idOrganizer: string;
}

export const useCreateMatch = () => {

    const createMatchQuery = useMutation({
        mutationKey:['createMatch'],
        mutationFn: createMatch,
    });

    return {
        createMatchQuery
    }
}