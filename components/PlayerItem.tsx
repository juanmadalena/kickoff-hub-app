import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { Player } from '@/interfaces';
import ProfilePicture from '@/components/ProfilePicture';
import { useThemeColor } from '@/components/Themed';
import BottomModal from '@/components/BottomModal';
import { Text } from '@/components/Themed';
import { useRemovePlayer } from '@/hooks/useMatch';
import ModalLoadingInfo from './ModalLoadingInfo';
import { sleep } from '@/utils/sleep';

type PlayerItemProps = {
    player: Player;
    isOrganizer: boolean;
    matchEnded?: boolean;
}

const PlayerItem = ( { player, isOrganizer, matchEnded = false }: PlayerItemProps ) => {

    const backgroundColor =useThemeColor({}, 'selectionBackground');
    const modalBackground = useThemeColor({}, 'itemBackground');

    const [ showBottomModal, setShowBottomModal ] = useState<boolean>(false)

    const [ showLoadingInfo, setShowLoadingInfo ] = useState<boolean>(false)
    const [ statusLoading, setStatusLoading ] = useState<'loading' | 'success' | 'error' >('loading')

    const { id: idMatch } = useLocalSearchParams()

    const { removePlayerQuery } = useRemovePlayer(idMatch as string)
    const queryClient = useQueryClient();

    const navigateToPlayerDetails = (id: string) => {
        router.push({
            pathname: '/(app)/profile/[id]',
            params: { id }
        })
    }

    const pressToRemovePlayer = () => {
        if(!matchEnded && isOrganizer) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            setShowBottomModal(true)
        }
    }

    const handleRemovePlayer = async () => {
        if(matchEnded) {
            return;
        }
        try{
            setStatusLoading('loading')
            setShowLoadingInfo(true)

            await removePlayerQuery.mutateAsync({ idMatch: idMatch as string, idUserToRemove: player.id})

            setStatusLoading('success')
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        }
        catch(err: any){
            setStatusLoading('error')
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
        finally{
            await sleep(2000)
            setShowBottomModal(false)
            setShowLoadingInfo(false)

            //Refetch players
            queryClient.refetchQueries({
                queryKey:[`matches/[id]/players`, idMatch],
            })
        }
    }

    return (
        <>
            <TouchableOpacity 
                activeOpacity={0.7} 
                key={player.id} 
                style={[styles.playerContainer]}
                onPress={() => navigateToPlayerDetails(player.id)}
                onLongPress={pressToRemovePlayer}
            >
                <View style={[styles.playerData]}>
                    <ProfilePicture uri={player.photo} player={player} />
                    <View style={[styles.playerText]}>
                        <Text adjustsFontSizeToFit numberOfLines={2} style={[styles.playerName]}>{player.first_name} {player.last_name}</Text>
                        <Text style={[styles.playerPosition]}>{player.position}</Text>
                    </View>
                </View>
                <View style={[styles.actionContainer]}>
                    <View style={[styles.ratingContainer, {backgroundColor}]}>
                        <View style={[]}>
                            <Text style={[styles.ratingText]}>
                                {player.rating?.toFixed(1) || '0.0'}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            {
                showBottomModal &&
                <BottomModal
                    allowDragDownToClose
                    transparent
                    setVisible={() => setShowBottomModal(false)}
                    modalBackground={modalBackground}
                    modalHeight={280}               
                >
                    <View style={{flex:1, alignItems:'center', justifyContent:'space-between', paddingVertical:12}}>
                        <Text style={{fontSize:20, fontWeight:'500', marginBottom:8}}>Remove Player</Text>
                        <View style={{alignItems:'center', marginBottom:8}}>
                            <ProfilePicture uri={player.photo} player={player} height={65} width={65} />
                            <Text style={{fontSize:18, fontWeight:'500', marginTop:10}}>{player.first_name} {player.last_name}</Text>
                            <Text style={{fontSize:16, color:'grey'}}>{player.position}</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between', width:'80%'}}>
                            <TouchableOpacity 
                                style={{height:40, justifyContent:'center', padding:8, borderRadius:8, backgroundColor:'#A3000077', width:'48%', alignItems:'center'}}
                                onPress={handleRemovePlayer}
                            >
                                <Text style={{color:'white', fontSize:16, fontWeight:'600'}}>Remove</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{height:40, justifyContent:'center', padding:8, borderRadius:8, backgroundColor:backgroundColor, width:'48%', alignItems:'center'}}
                                onPress={() => setShowBottomModal(false)}
                            >
                                <Text style={{color:'white', fontSize:16, fontWeight:'600'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                { showLoadingInfo && <ModalLoadingInfo status={statusLoading} /> }
                </BottomModal>
            }
        </>
    );
};

const styles = StyleSheet.create({
    playerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    playerData: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 0,
        width: '82%'
    },
    playerText: {
        flex:1,
        marginLeft: 10,
    },
    playerName: {
        fontSize: 16,
        fontWeight: '500'
    },
    playerPosition: {
        fontSize: 14,
        color: 'grey'
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        width: 45,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 14,
        opacity: 0.6,
        fontWeight: 'bold'
    },
});

export default PlayerItem;