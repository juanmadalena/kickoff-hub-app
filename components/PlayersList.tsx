import { useEffect } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { View, Text, useThemeColor } from '@/components/Themed';
import { useFade } from '@/hooks/useFade';
import { Player } from '@/interfaces';
import ProfilePicture from './ProfilePicture';
import Icon from './Icon';

interface PlayersListProps {
    players: Player[] | undefined; 
    isOrganizer?: boolean;      
}

const PlayersList = ( {players, isOrganizer = false}: PlayersListProps ) => {

    const { opacity, fadeIn } = useFade();
    const backgroundColor = useThemeColor({}, 'selectionBackground');

    const router = useRouter()

    useEffect(() => {
        fadeIn(400);
    }, [])

    const navigateToPlayerDetails = (id: string) => {
        router.push({
            pathname: '/(app)/profile/[id]',
            params: { id }
        })
    }

    return (
        <View style={[styles.transparentBackground]}>
            {
                players?.length === 0 ?
                <Text>No players yet</Text>
                :
                <Animated.View style={{opacity}}>
                    {
                        players?.map( player => (
                            <TouchableOpacity 
                                activeOpacity={0.7} 
                                key={player.id} 
                                style={[styles.transparentBackground, styles.playerContainer]}
                                onPress={() => navigateToPlayerDetails(player.id)}
                            >
                                <View style={[styles.transparentBackground, styles.playerData]}>
                                    <ProfilePicture uri={player.photo} player={player} />
                                    <View style={[styles.transparentBackground, styles.playerText]}>
                                        <Text style={[styles.playerName]}>{player.first_name} {player.last_name}</Text>
                                        <Text style={[styles.playerPosition]}>{player.position}</Text>
                                    </View>
                                </View>
                                <View style={[styles.transparentBackground, styles.actionContainer]}>
                                    <View style={[styles.ratingContainer, {backgroundColor}]}>
                                        <View style={[styles.transparentBackground]}>
                                            <Text style={[styles.ratingText]}>
                                                {player.rating || '0.0'}
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        isOrganizer &&
                                        <View style={[styles.removeContainer]}>
                                            <View style={[styles.transparentBackground]}>
                                                <Icon name="close" size={20} color="red" />
                                            </View>
                                        </View>
                                    }
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </Animated.View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    transparentBackground: {
        backgroundColor: 'transparent'
    },
    playerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    playerData: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerText: {
        marginLeft: 10
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
    removeContainer: {
        marginLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,0,0,0.1)'
    },
    removeText: {
        fontSize: 14,
        opacity: 0.6
    }
});

export default PlayersList;