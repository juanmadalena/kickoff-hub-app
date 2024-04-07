import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/config/api";
import { MatchResponse, createMatchProps, updateMatchProps, cancelMatchProps } from "@/interfaces";

const getMatchById = async (id: string): Promise<MatchResponse> => {
    const { data } = await api.get(`/matches/${id}`);
    return data;
}

const createMatch = async (form: createMatchProps) => {
    const { data } = await api.post('/matches', form);
    return data;
}

const updateMatch = async (form: updateMatchProps) => {
    const { data } = await api.put(`/matches`, form);
    return data;
}

const cancelMatch = async (form: cancelMatchProps) => {
    const { data } = await api.delete(`/matches/${form.idMatch}`);
    return data;
}

const removePlayer = async ({idMatch, idUserToRemove}: {[key:string]:string}) => {
    const { data } = await api.post(`/matches/${idMatch}/remove`, { idUserToRemove });
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

export const useCreateMatch = () => {

    const createMatchQuery = useMutation({
        mutationKey:['createMatch'],
        mutationFn: createMatch,
    });

    return {
        createMatchQuery
    }
}

export const useUpdateMatch = () => {  
    const updateMatchQuery = useMutation({
        mutationKey:['updateMatch'],
        mutationFn: updateMatch,
    });

    return {
        updateMatchQuery
    }
}

export const useCancelMatch = () => {
    const cancelMatchQuery = useMutation({
        mutationKey:['cancelMatch'],
        mutationFn: cancelMatch,
    });

    return {
        cancelMatchQuery
    }
}

export const useRemovePlayer = (idMatch: string) => {
    
    const removePlayerQuery = useMutation({
        mutationKey:['removePlayer'],
        mutationFn: removePlayer,
    });

    return {
        removePlayerQuery
    }
}