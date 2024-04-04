import { useEffect } from 'react';
import { Animated, View } from 'react-native';

import { Text } from '@/components/Themed';
import { useFade } from '@/hooks/useFade';
import { Player } from '@/interfaces';
import PlayerItem from './PlayerItem';

interface PlayersListProps {
    players: Player[] | undefined; 
    isOrganizer?: boolean;   
    matchEnded?: boolean;   
}

const PlayersList = ( {players, isOrganizer = false, matchEnded = false,}: PlayersListProps ) => {

    const { opacity, fadeIn } = useFade();

    useEffect(() => {
        fadeIn(400);
    }, [])

    return (
        <View style={[]}>
            {
                players?.length === 0 ?
                <View style={{width:'100%', alignItems:'center', justifyContent:'center', height:40}}>
                    <Text style={{opacity:0.4}}>No players yet</Text>
                </View>
                :
                <Animated.View style={{opacity}}>
                    {
                        players?.map( player => (
                           <PlayerItem key={player.id} player={player} isOrganizer={isOrganizer} matchEnded={matchEnded} />
                        ))
                    }
                </Animated.View>
            }
        </View>
    );
};

export default PlayersList;