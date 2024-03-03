import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/config/api";
import { PlayersResponse, Position } from "@/interfaces";

const getPlayersByMatchId = async (id: string): Promise<PlayersResponse> => {
    const { data } = await api.get(`/matches/${id}/players`);
    return data;
}

const joinMatch = async (idMatch: string, idUser: string) => {
    const { data } =  await api.post(`/matches/${idMatch}/join`, {idMatch, idUser, position:'GK'});
    return data;
}

const leaveMatch = async (idMatch: string, idUser: string) => {
    const { data } =  await api.post(`/matches/${idMatch}/leave`, {idMatch, idUser});
    return data;
}

const updateUserBasicInfo = async ( userInfo: {firstName:string, lastName:string, position: Position} ) => {
    const { data } =  await api.put(`/user/`, {...userInfo});
    return data;
}

const uploadProfilePhoto = async (formData: FormData) => {
    console.log('uploadProfilePhoto');
    const { status } = await api.post('/user/uploadProfilePhoto', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return status;
}

export const usePlayers = (id: string) => {
    const playersQuery = useQuery({
        queryKey: ['matches/[id]/players', id],
        queryFn: () => getPlayersByMatchId(id),
    });

    return {
        playersQuery
    }
}

export const useJoinMatch = (idMatch: string, idUser: string) => {

    const queryClient = useQueryClient();

    const joinMatchQuery = useMutation({
        mutationKey: ['join', idMatch],
        mutationFn: () => joinMatch(idMatch, idUser),   
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey:[`matches/[id]/players`, idMatch],
            });
            queryClient.refetchQueries({
                queryKey:[`matches/[id]`, idMatch],
            });
        }         
    });

    return{
        joinMatchQuery
    }
}

export const useLeaveMatch = (idMatch: string, idUser: string) => {

    const queryClient = useQueryClient();

    const leaveMatchQuery = useMutation({
        mutationKey: ['leave', idMatch],
        mutationFn: () => leaveMatch(idMatch, idUser),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey:[`matches/[id]/players`, idMatch],
            });
            queryClient.refetchQueries({
                queryKey:[`matches/[id]`, idMatch],
            });
        }  
    });

    return{
        leaveMatchQuery
    }
}

export const useUploadProfilePhoto = () => {

    const uploadProfilePhotoQuery = useMutation({
        mutationKey: ['uploadProfilePhoto'],
        mutationFn: (formData: FormData) => uploadProfilePhoto(formData),
        onSuccess: () => {
            console.log('Photo uploaded');
        },
        onError: (error) => {
            console.log(error);
        },
    });

    return{
        uploadProfilePhotoQuery
    }
}

export const useUpdateUserBasicInfo = () => {

    const updateUserBasicInfoQuery = useMutation({
        mutationKey: ['updateUserBasicInfo'],
        mutationFn: ( userInfo: {firstName:string, lastName:string, position: Position} ) => updateUserBasicInfo(userInfo),
        onSuccess: () => {
            console.log('User basic info updated');
        },
        onError: (error) => {
            console.log(error);
        },
    });

    return{
        updateUserBasicInfoQuery
    }
}