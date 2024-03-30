import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/config/api";
import { MatchResponse } from "@/interfaces";
import axios from "axios";

const getMatchById = async (id: string): Promise<MatchResponse> => {
    const { data } = await api.get(`/matches/${id}`);
    return data;
}

const createMatch = async (form: createMatchProps) => {
    // const { data } = await api.post('/matches', form);
    const { data } = await axios.post('http://192.168.0.248:8020/matches', form, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQzOTczNzBjLWQ2OWQtNDk5OS05OTMyLTVlY2Y5OGIyOThiNCIsImlhdCI6MTcxMTIzNDYyMCwiZXhwIjoxNzEyNDQ0MjIwfQ.zOhZ20LoA7FjOs8IvR0xpEklRde8UD0hJ6n0uzVHSGg'
        }
    
    });
    console.log(data);
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
        onSuccess: ()=>{
            console.log("Vamooo")
        },
        onError: (error) => {
            console.log(error);
        }
    });

    return {
        createMatchQuery
    }
}