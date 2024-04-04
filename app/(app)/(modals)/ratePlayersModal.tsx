import ProfilePicture from '@/components/ProfilePicture';
import { View, StyleSheet } from 'react-native';
import { Text, useThemeColor } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { usePlayersToRate, useRatePlayer } from '@/hooks/usePlayers';
import { useLocalSearchParams } from 'expo-router';
import Rate from '@/components/Rate';
import LoadingComponent from '@/components/LoadingComponent';
import { useRef } from 'react';

const ratePlayersModal= () => {

    const { idMatch } = useLocalSearchParams<{ idMatch: string }>();
    const { playersToRateQuery } = usePlayersToRate(idMatch as string)
    

    const rate = useRef(0);
    const idUserRated = useRef('');
    const { ratePlayerQuery } = useRatePlayer()

    const backgroundColor = useThemeColor({}, 'itemBackground');

    const handleRate = async (value: number, id: string) => {
        rate.current = value;
        idUserRated.current = id;
        
        if(rate.current != 0 && idUserRated.current != '') {
            await ratePlayerQuery.mutateAsync({idMatch, idUserRated: idUserRated.current, rate: rate.current})
        }
    }

    return (
        <View style={{paddingTop:4, flex:1}}>
            <View style={{width:'100%', backgroundColor:'transparent', alignItems: 'center', justifyContent: 'center', marginTop:10, marginBottom:8}}>
                <View style={{backgroundColor:'grey', opacity:1, borderRadius:18, width:100, height:5, marginBottom:8}}>
                </View>
                <TopBarNavigator
                    title='Rate Players'
                    icon='check'
                    activeColor={true}
                />
            </View>
            {
                playersToRateQuery.isLoading &&
                <LoadingComponent />
            }
            {
                playersToRateQuery.isError &&
                <View>
                    <Text>There was an error 😞 </Text>
                </View>
            }
            {
                playersToRateQuery.isSuccess && playersToRateQuery.data?.players.length === 0 &&
                <View style={{width:'100%', alignItems:'center', justifyContent:'center', flex:1}}>
                    <Text style={{opacity:0.4}}>No players to rate</Text>
                </View>
            }
            {
                playersToRateQuery.isSuccess && playersToRateQuery.data?.players.length > 0 &&
                <>
                    {
                        playersToRateQuery.data?.players.filter((player: any) => player.rating == null).length == 0 &&
                        <View style={[styles.playerListContainer]}>
                            <View style={[styles.playerItem, {backgroundColor}]}>
                                <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize:16, width:'100%', fontWeight:'500', paddingVertical:8, alignItems:'center', textAlign:'center'}}>
                                    Thanks for Rating Your Teammates!🏅
                                </Text>
                            </View>
                        </View>
                    }
                    <View style={[styles.playerListContainer]}>
                    {
                        playersToRateQuery.data?.players.map((player: any) => {
                            return (
                                <View key={player.id} 
                                    style={[styles.playerItem, {backgroundColor, opacity: player.rating ? 0.5 : 1}]}>
                                    <View style={[styles.playerDetails]}>
                                        <View style={{borderWidth:0, borderColor:'red'}}>
                                            <ProfilePicture player={player} uri={player.photo} allowFullScreen />
                                        </View>
                                        <View style={[styles.playerName]}>
                                            <Text 
                                                style={{fontSize:16, fontWeight:'500', marginLeft:4}}
                                                numberOfLines={1}
                                                adjustsFontSizeToFit
                                            >
                                                {player.first_name}
                                            </Text>
                                            <Text 
                                                style={{fontSize:16, fontWeight:'500', marginLeft:4}}
                                                numberOfLines={1}
                                                adjustsFontSizeToFit
                                            >
                                                {player.last_name}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.playerRating]}>
                                        <Rate rate={player.rating} onChange={(value) => handleRate(value, player.id)} />
                                    </View>
                                </View>
                            )
                        })
                    }
                    </View>
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    playerListContainer: {
        paddingHorizontal:16, 
        borderWidth:0, 
        borderColor:'green', 
        width:'100%'
    },
    playerItem: {
        paddingVertical:12, 
        paddingHorizontal:8, 
        paddingRight:14, 
        borderWidth:0, 
        borderRadius:12, 
        flexDirection:'row', 
        borderColor:'red', 
        width:'100%', 
        justifyContent:'space-between', 
        alignItems:'center',
        marginBottom:8
    },
    playerDetails: {
        flexDirection:'row', 
        alignItems:'center',
        borderWidth:0,
        borderColor:'blue',
        width:'60%'

    },
    playerName: {
        fontSize:16, 
        fontWeight:'500', 
        marginLeft:6,
        borderWidth:0,
        borderColor:'purple',
        flex:1
    },
    playerRating: {
        flexDirection:'row',
        borderWidth:0,
        borderColor:'yellow'
    }
});

export default ratePlayersModal;