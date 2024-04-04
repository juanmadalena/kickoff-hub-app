import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/config/api";
import { PlayersResponse, Position } from "@/interfaces";

type RatePlayerParams = {
    idMatch: string;
    idUserRated: string;
    rate: number;
}

const getPlayersByMatchId = async (id: string): Promise<PlayersResponse> => {
    const { data } = await api.get(`/matches/${id}/players`);
    return data;
}

const getPlayersToRate = async (idMatch: string) => {
    const { data } =  await api.get(`/matches/${idMatch}/playersToRate`);
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

const ratePlayer = async ( { idMatch, idUserRated, rate }: RatePlayerParams ) => {
    const { data } =  await api.post(`/matches/${idMatch}/ratePlayer`, {idUserRated , rate});
    return data;
}

const updateUserBasicInfo = async ( userInfo: {firstName:string, lastName:string, position: Position} ) => {
    const { data } =  await api.put(`/user/`, {...userInfo});
    return data;
}

const updatePassword = async (oldPassword: string, newPassword: string) => {
    const { data } =  await api.put(`/user/updatePassword`, {oldPassword, newPassword});
    return data;
}

const updateEmail = async (email: string) => {
    const { data } =  await api.put(`/user/updateEmail`, {email});
    return data;
}

const uploadProfilePhoto = async (formData: FormData) => {
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

export const usePlayersToRate = (idMatch: string) => {
    const playersToRateQuery = useQuery({
        queryKey: ['matches/[idMatch]/playersToRate', idMatch],
        queryFn: () => getPlayersToRate(idMatch),
    });

    return {
        playersToRateQuery
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
            queryClient.refetchQueries({
                queryKey: ['matches/played'],
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
            queryClient.refetchQueries({
                queryKey: ['matches/played'],
            });
        }  
    });

    return{
        leaveMatchQuery
    }
}

export const useRatePlayer = () => {

    const queryClient = useQueryClient();
    
    const ratePlayerQuery = useMutation({
        mutationKey: ['ratePlayer'],
        mutationFn:ratePlayer,
        onMutate: async ( { idMatch, idUserRated, rate }: RatePlayerParams ) => {
            queryClient.setQueryData(
                ['matches/[idMatch]/playersToRate', idMatch],
                (oldData: PlayersResponse | undefined) => {
                    if(oldData) {

                        const playerIndex = oldData.players.findIndex(player => player.id === idUserRated);
                        
                        if(playerIndex === -1) return oldData;

                        oldData.players[playerIndex].rating = rate;

                        return oldData;
                    }
                    return oldData;
                }
            )
        }
    });

    return{
        ratePlayerQuery
    }
}

export const useUploadProfilePhoto = () => {

    const uploadProfilePhotoQuery = useMutation({
        mutationKey: ['uploadProfilePhoto'],
        mutationFn: (formData: FormData) => uploadProfilePhoto(formData),
    });

    return{
        uploadProfilePhotoQuery
    }
}

export const useUpdateUserBasicInfo = () => {

    const updateUserBasicInfoQuery = useMutation({
        mutationKey: ['updateUserBasicInfo'],
        mutationFn: ( userInfo: {firstName:string, lastName:string, position: Position} ) => updateUserBasicInfo(userInfo),
    });

    return{
        updateUserBasicInfoQuery
    }
}

export const useUpdatePassword = () => {
    
    const updatePasswordQuery = useMutation({
        mutationKey: ['updatePassword'],
        mutationFn: ( {oldPassword, newPassword}: {oldPassword: string, newPassword: string} ) => updatePassword(oldPassword, newPassword),
    });

    return{
        updatePasswordQuery
    }
}

export const useUpdateEmail = () => {
    
    const updateEmailQuery = useMutation({
        mutationKey: ['updateEmail'],
        mutationFn: ( email: string ) => updateEmail(email),
    });

    return{
        updateEmailQuery
    }
}