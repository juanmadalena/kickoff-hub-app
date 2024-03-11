import { View as DefaultView, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Button, Text, View, useThemeColor } from '@/components/Themed';
import { useMatch } from '@/hooks/useMatch';
import { formatDateToString } from '@/utils/formatDateToString';
import ProfilePicture from '@/components/ProfilePicture';
import SwipeButton from '@/components/SwipeButton';
import BottomModal from '@/components/BottomModal';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useJoinMatch, useLeaveMatch, usePlayers } from '@/hooks/usePlayers';
import Icon from '@/components/Icon';
import PlayersList from '@/components/PlayersList';
import Map from '@/components/Map';
import { formatTimeDuration } from '@/utils/formatTimeDuration';
import { checkIfMatchIsAvailable } from '@/utils/checkIfMatchIsAvailable';
import MutationStatus from '@/components/MutationStatus';
import { sleep } from '@/utils/sleep';
import LoadingComponent from '@/components/LoadingComponent';
import TopBarNavigator from '@/components/TopBarNavigator';

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
    
    //State for the modal
    const [ showModal, setShowModal ] = useState(false);

    //State for the swipe button
    const [ swipeType, setSwipeType ] = useState<'join' | 'leave' | 'full' | 'disabled'>('join');
    const [ isMutationGoing, setIsMutationGoing ] = useState<'joining' | 'leaving'>();

    //Handle the mutation and close the modal
    const handleMutation = async (mutation: any, action: 'joining' | 'leaving') => {
        setIsMutationGoing(action)
        await mutation.mutateAsync();
        closeModal()
    }
        
    useEffect(() => {
        setSwipeType( checkIfMatchIsAvailable( matchQuery.data?.match , playersQuery.data?.players, user?.id! ) );
    }, [playersQuery])

    const resetMutations = () => {
        joinMatchQuery.reset();
        leaveMatchQuery.reset();
    }

    const closeModal = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        //Time so the user can see the success or error message
        await sleep(1000);
        setShowModal(false);
        setIsMutationGoing(undefined);
        resetMutations();
    }

    return (
        <>
            <TopBarNavigator />
            {/* <Button onPress={() => router.navigate({pathname:'/(app)/match/matchModal', params:{id}})}>
                <Text>Match</Text>
            </Button> */}
            <View style={{flex:1}}>
                    {
                        matchQuery.isLoading ?
                        <LoadingComponent />
                        :
                        matchQuery.isError ?
                        <Text>Error loading match</Text>
                        :
                        matchQuery.data &&
                        <>
                        <ScrollView style={{height:'100%'}} bounces={false} showsVerticalScrollIndicator={false}>
                            {/* Location */}
                            <View style={[styles.container, { flexDirection:'column' }]}>
                                <View style={[styles.dataContainer, {width:'100%', backgroundColor: backgroungColor}]}>
                                    <DefaultView style={[styles.mapContainer]}>
                                        <Map initialRegion={{latitude: matchQuery.data?.match.latitude!, longitude: matchQuery.data?.match.longitude!, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }} />
                                    </DefaultView>  
                                    <DefaultView style={{marginTop:10, backgroundColor:'transparent', borderWidth:0, borderColor:'red', width:'100%'}}>
                                        <Text style={[styles.locationTitle]}>
                                            {matchQuery.data?.match.location}
                                        </Text>
                                        <Text style={[styles.dataTitle, { paddingHorizontal:12, textAlign:'center' }]}>
                                            97 Slievenamon Rd, Drimnagh, Dublin 12, D12 FX97
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
                        <SwipeButton 
                            type={swipeType}
                            onSwiped={() => setShowModal(true)} />
                        <View>
                            {
                                showModal &&
                                    <BottomModal 
                                        duration={300}
                                        transparent={true}
                                        visible={showModal}
                                        animationType='fade'
                                        modalHeight={220}
                                        setVisible={() => setShowModal(false)}
                                    >
                                        {
                                            isMutationGoing ?
                                            <DefaultView style={{position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'transparent', alignItems:'center', justifyContent:'center'}}>
                                                {
                                                    isMutationGoing === 'joining' ?
                                                    <MutationStatus mutation={joinMatchQuery} successMessage={'Enjoy!!'} />
                                                    : isMutationGoing === 'leaving' &&
                                                    <MutationStatus mutation={leaveMatchQuery} successMessage={'See you soon'} />
                                                }
                                            </DefaultView>
                                            :
                                            <DefaultView style={{justifyContent:'space-between', backgroundColor:'transparent', flex:1, paddingVertical:4, paddingHorizontal:4}}>
                                                <DefaultView style={{backgroundColor:'transparent', width:'100%', alignItems:'flex-end'}}>
                                                    <TouchableOpacity onPress={() => setShowModal(false)} style={{borderRadius:20, backgroundColor:backgroungColor, opacity:0.4, padding:2}}>
                                                        <Icon name={"close"} style={{opacity:0.4}} />
                                                    </TouchableOpacity>
                                                </DefaultView>
                                                <Text style={{fontSize:24, textAlign:'center'}}>
                                                    {swipeType === 'join' ? 'Join' : 'Leave'} the match? { swipeType === 'join' ? '⚽' : '😢' }
                                                </Text>
                                                <Button 
                                                    onPress={() => handleMutation(swipeType === 'join'? joinMatchQuery : leaveMatchQuery, swipeType === 'join' ? 'joining' : 'leaving')}
                                                    style={{marginTop:8, width:'100%'}}
                                                >
                                                    <Text>
                                                        {swipeType === 'join' ? 'Join' : 'Leave'}
                                                    </Text>
                                                </Button>
                                            </DefaultView>
                                        }
                                    </BottomModal>
                            }
                        </View>
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
        width:'100%', 
        height:'45%', 
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