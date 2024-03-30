import { useContext, useEffect, useState } from 'react';
import { View as DefaultView, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useMatch } from '@/hooks/useMatch';
import { formatDateToString } from '@/utils/formatDateToString';
import ProfilePicture from '@/components/ProfilePicture';
import SwipeButton from '@/components/SwipeButton';
// import BottomModal from '@/components/BottomModal';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useJoinMatch, useLeaveMatch, usePlayers } from '@/hooks/usePlayers';
// import Icon from '@/components/Icon';
import PlayersList from '@/components/PlayersList';
import Map from '@/components/Map';
import { formatTimeDuration } from '@/utils/formatTimeDuration';
import { checkIfMatchIsAvailable } from '@/utils/checkIfMatchIsAvailable';
// import MutationStatus from '@/components/MutationStatus';
import { sleep } from '@/utils/sleep';
import LoadingComponent from '@/components/LoadingComponent';
import TopBarNavigator from '@/components/TopBarNavigator';
import ModalLoadingInfo from '@/components/ModalLoadingInfo';

const Match = () => {

    //Get the match id passed from the route
    const { id } = useLocalSearchParams()
    
    //Get the user from the context
    const { user } = useContext( AuthContext );
    
    //Get the match data from the id
    const { matchQuery } = useMatch(id as string)

    //Get the background color from the theme
    const backgroungColor = useThemeColor({}, 'itemBackground')

    //Get the players from the match
    const { playersQuery } = usePlayers(id as string)

    //Mutations for joining and leaving the match
    const { joinMatchQuery } = useJoinMatch(id as string, user?.id! )
    const { leaveMatchQuery } = useLeaveMatch(id as string, user?.id! )
    
    //State for the loading modal
    const [ showLoadingInfo, setShowLoadingInfo ] = useState(false);
    const [ statusLoading, setStatusLoading ] = useState<'success' | 'error' | 'loading'>('loading');

    //State for the swipe button
    const [ swipeType, setSwipeType ] = useState<'join' | 'leave' | 'full' | 'disabled' | undefined >(undefined);

    useEffect(() => {
        setSwipeType( checkIfMatchIsAvailable( matchQuery.data?.match , playersQuery.data?.players, user?.id! ) );
    }, [playersQuery.data?.players, matchQuery.data?.match])

    //Handle the mutation and show loading modal
    const handleSwiped = async () => {
        try{
            setShowLoadingInfo(true)
            if(swipeType === 'join') {
                await joinMatchQuery.mutateAsync();
            }
            if(swipeType === 'leave') {
                await leaveMatchQuery.mutateAsync();
            }
            setStatusLoading('success')
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }
        catch(e){
            setStatusLoading('error')
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
        finally{
            await sleep(1000)
            setShowLoadingInfo(false)
            setStatusLoading('loading')
        }
    }

    return (
        <>
            <TopBarNavigator />
            {/* <Button onPress={() => router.navigate({pathname:'/(app)/(modals)/[matchModal]', params:{matchModal:id}})}>
                <Text>Match</Text>
            </Button> */}
            <View style={{flex:1}}>
                    {
                        matchQuery.isLoading ?
                        <LoadingComponent />
                        :
                        matchQuery.isError ?
                        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                            <Text>Error loading match</Text>
                        </View>
                        :
                        matchQuery.data &&
                        <>
                        <ScrollView style={{height:'100%'}} bounces={false} showsVerticalScrollIndicator={false}>
                            {/* Location */}
                            <View style={[styles.container, { flexDirection:'column' }]}>
                                <View style={[styles.dataContainer, {width:'100%', backgroundColor: backgroungColor}]}>
                                    <DefaultView style={[styles.mapContainer]}>
                                        <Map 
                                            initialRegion={{latitude: matchQuery.data?.match.latitude!, longitude: matchQuery.data?.match.longitude!, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }} 
                                            markers={[{latitude: matchQuery.data?.match.latitude!, longitude: matchQuery.data?.match.longitude!}]}
                                        />
                                    </DefaultView>  
                                    <DefaultView style={{marginVertical:10, backgroundColor:'transparent', borderWidth:0, borderColor:'red', width:'100%'}}>
                                        <Text style={[styles.locationTitle]}>
                                            {matchQuery.data?.match.location}
                                        </Text>
                                        <Text style={[styles.dataTitle, { paddingHorizontal:12, textAlign:'center' }]}>
                                            {matchQuery.data?.match.address}
                                        </Text>
                                    </DefaultView>
                                </View>
                            </View>

                            {/* Date, Hour, Duration */}
                            <View style={[styles.container]}>
                                <View style={[ styles.dataContainer, {height:110, width:'32%', backgroundColor: backgroungColor }]}>
                                    <Text style={[styles.dataTitle]}>Date</Text>
                                    <Text style={[styles.dataText]} adjustsFontSizeToFit>
                                        { formatDateToString(matchQuery.data?.match.date!, 'dd/mm') }
                                    </Text>
                                    <Text></Text>
                                </View>
                                <View style={[styles.dataContainer, {height:110, width:'32%', backgroundColor: backgroungColor}]}>
                                    <Text style={[styles.dataTitle]}>Hour</Text>
                                    <Text style={[styles.dataText]} adjustsFontSizeToFit>
                                        { formatTimeDuration(matchQuery.data?.match.time!) }
                                    </Text>
                                    <Text></Text>
                                </View>
                                <View style={[styles.dataContainer, {height:110, width:'32%', backgroundColor: backgroungColor}]}>
                                    <Text style={[styles.dataTitle]}>Duration</Text>
                                    <Text style={[styles.dataText]} adjustsFontSizeToFit>
                                        { formatTimeDuration(matchQuery.data?.match.duration!) }
                                    </Text>
                                    <Text></Text>
                                </View>
                            </View>
                            {/* Players */}
                            <View style={[styles.container, { flexDirection:'column' }]}>
                                <View style={[styles.dataContainer, {width:'100%', backgroundColor: backgroungColor}]}>
                                    <DefaultView style={{backgroundColor:'transparent', width:'100%', paddingHorizontal:16, paddingVertical:8, flexDirection:'row', justifyContent:'space-between', borderWidth:0, borderColor:'red'}}>
                                        <Text style={[styles.dataTitle]}>Players</Text>
                                        <Text style={[styles.dataTitle]}>
                                            {matchQuery.data?.match.num_players} / {matchQuery.data?.match.max_players}
                                        </Text>
                                    </DefaultView>
                                    <DefaultView style={{backgroundColor:'transparent', borderWidth:0, borderColor:'red', width:'100%', paddingHorizontal:10}}>
                                        <DefaultView style={{backgroundColor:'transparent', paddingHorizontal:10, paddingVertical:10}}>
                                            {
                                                playersQuery.isLoading ?
                                                <LoadingComponent size={'small'} />
                                                :
                                                playersQuery.isError ?
                                                <Text>Error loading players</Text>
                                                :
                                                <PlayersList players={playersQuery.data?.players} />
                                            }
                                        </DefaultView>
                                    </DefaultView>
                                </View>
                            </View>

                            {/* Organizer */}
                            <TouchableWithoutFeedback onPress={() => router.push({pathname:'/(app)/profile/[id]', params: { id: matchQuery.data.match.organizer?.id! }})}>
                                <View style={[styles.container]}>
                                    <View style={[styles.dataContainer ,{width:'49%', backgroundColor: backgroungColor }]}>
                                        <Text style={[styles.dataTitle, {marginBottom:10}]}>Organizer</Text>
                                        <DefaultView style={{backgroundColor:'transparent',width:'100%', alignItems:'center', marginBottom:10}}>
                                            <ProfilePicture player={matchQuery.data.match.organizer} uri={matchQuery.data.match.organizer?.photo!} />
                                            <Text style={{fontSize:16, marginTop:8}}>{matchQuery.data.match.organizer?.first_name} {matchQuery.data.match.organizer?.last_name}</Text>
                                        </DefaultView>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={{height:68}}></View>
                        </ScrollView>
                        {
                            <SwipeButton 
                                type={swipeType!}
                                onSwiped={handleSwiped}
                            />
                        }
                        {
                            showLoadingInfo && <ModalLoadingInfo status={statusLoading} />
                        }
                        </>
                    }
            </View>
        </>
    );
};


const styles = StyleSheet.create({

    container: {
        flexDirection:'row', 
        flex:1, 
        justifyContent:'space-between', 
        paddingHorizontal:12, 
        marginBottom:8
    },
    dataContainer: {
        borderRadius:16, 
        alignItems:'center', 
        justifyContent:'space-between', 
        paddingVertical:8
    },
    dataText: {
        fontSize:120,
        width:'75%', 
        height:'40%', 
        textAlign:'center'
    },
    dataTitle: {
        fontSize:16, 
        opacity:0.2
    },
    locationTitle: {
        fontSize:34, 
        fontWeight:'500', 
        textAlign:'center', 
        marginBottom:8
    },
    mapContainer: {
        height: 210, 
        width:'100%', 
        paddingVertical:4, 
        paddingHorizontal:12, 
    },

});


export default Match;