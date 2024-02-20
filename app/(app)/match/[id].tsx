import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Button, Text, View, useThemeColor } from '@/components/Themed';
import { useMatch } from '@/hooks/useMatch';
import { formatDateToString } from '../../../utils/formatDateToString';
import MapView, { Marker } from 'react-native-maps';
import ProfilePicture from '@/components/ProfilePicture';
import SwipeButton from '@/components/SwipeButton';
import BottomModal from '@/components/BottomModal';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useJoinMatch, usePlayers } from '@/hooks/usePlayers';

const Match = () => {

    
    //Get the match id passed from the route
    const { id } = useLocalSearchParams()

    //Get the user from the context
    const { user } = useContext( AuthContext );
    
    //Get the match data from the id
    const { matchQuery: { data, isLoading, isError } } = useMatch(id as string)

    const { playersQuery } = usePlayers(id as string)
    const { joinMatchQuery } = useJoinMatch(id as string, user?.id! )

    // useEffect(() => {
    //     if(joinMatchQuery.isSuccess){
    //         playersQuery.refetch();
    //         checkIfMatchIsAvailable();
    //         setShowModal(false);
    //     }
    // }, [joinMatchQuery.isSuccess])

    //State for the modal
    const [ showModal, setShowModal ] = useState(false);

    //State for the swipe button
    const [ swipeType, setSwipeType ] = useState<'join' | 'leave' | 'full' | 'disabled'>('join');

    //check if the match is available
    const checkIfMatchIsAvailable = () => {
        const formatDate = data?.match.date.split('T')[0]
        const matchDate = new Date(formatDate+'T'+data?.match.time+'.000Z');

        //Check if the match is in the past
        if( matchDate < new Date() ){
            return setSwipeType('disabled');
        }

        //Check if the match is full
        if( data?.match.players.length! >= data?.match.max_players!){
            return setSwipeType('full');
        }
        
        //Check if the user is already in the match
        if( playersQuery.data?.players.find(player => player.id === user?.id ) ){
            return setSwipeType('leave');
        }

        return setSwipeType('join');
    }

    const handleJoinMatch = () => {
        joinMatchQuery.mutate();
    }

    useEffect(() => {
        if(joinMatchQuery.isSuccess){
            setSwipeType('leave')
            setShowModal(false);
            playersQuery.refetch();
        }
        checkIfMatchIsAvailable();
    }, [playersQuery.data, joinMatchQuery.isSuccess])

    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

    const backgroungColor = useThemeColor({}, 'itemBackground')

    return (
        <View style={{flex:1}}>
                {
                    isLoading &&
                    <ActivityIndicator size={40} color={'grey'} />
                }
                {
                    isError &&
                    <Text>Match not found!</Text>
                }
                {
                    data &&
                    <>
                    <ScrollView style={{height:'100%'}} bounces={false}>
                        {/* Location */}
                        <View style={{flexDirection:'column', flex:1, justifyContent:'space-between', paddingHorizontal:12, marginBottom:8}}>
                            <View style={{width:'100%', borderRadius:16, backgroundColor: backgroungColor, alignItems:'center', justifyContent:'space-around', paddingVertical:8}}>
                                <View style={{ height: 210, width:'100%', paddingVertical:4, paddingHorizontal:12, backgroundColor:'transparent' }}>
                                    <MapView style={styles.map} 
                                        initialRegion={initialRegion}
                                        maxDelta={0.1}
                                        minDelta={0.01}   
                                        scrollEnabled={false}   
                                        mapType='standard'    
                                    />
                                        <Marker
                                            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
                                            title="Mi Marcador"
                                            description="Descripción de mi marcador"
                                        />
                                </View>  
                                <View style={{marginTop:10, backgroundColor:'transparent', borderWidth:0, borderColor:'red', width:'100%'}}>
                                    {/* <Text style={{textAlign:'center', opacity:0.2}}>
                                        Location
                                    </Text> */}
                                    <Text style={{ fontSize:34, fontWeight:'500', textAlign:'center', marginBottom:8 }}>
                                        {data?.match.location}
                                    </Text>
                                    <Text style={{opacity:0.6, textAlign:'center',marginBottom:6, paddingHorizontal:12}}>
                                        97 Slievenamon Rd, Drimnagh, Dublin 12, D12 FX97
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Date, Hour, Duration */}
                        <View style={{flexDirection:'row', flex:1, justifyContent:'space-between', paddingHorizontal:12, marginBottom:8}}>
                            <View style={{height:110, width:'32%', borderRadius:16, backgroundColor: backgroungColor, alignItems:'center', justifyContent:'space-around', paddingVertical:8}}>
                                <Text style={{opacity:0.2}}>Date</Text>
                                <Text style={{ fontSize:120, borderColor:'green', borderWidth:0, width:'100%', height:'45%', textAlign:'center' }} adjustsFontSizeToFit>
                                    { formatDateToString(data?.match.date, 'dd/mm') }
                                </Text>
                                <Text></Text>
                            </View>
                            <View style={{height:110, width:'32%', borderRadius:16, backgroundColor: backgroungColor, alignItems:'center', justifyContent:'space-around', paddingVertical:8}}>
                                <Text style={{opacity:0.2}}>Hour</Text>
                                <Text style={{ fontSize:120, borderColor:'green', borderWidth:0, width:'100%', height:'45%', textAlign:'center' }} adjustsFontSizeToFit>
                                    { data?.match.time.slice(0,-3) }
                                </Text>
                                <Text></Text>
                            </View>
                            <View style={{height:110, width:'32%', borderRadius:16, backgroundColor: backgroungColor, alignItems:'center', justifyContent:'space-around', paddingVertical:8}}>
                                <Text style={{opacity:0.2}}>Duration</Text>
                                <Text style={{ fontSize:120, borderColor:'green', borderWidth:0, width:'100%', height:'45%', textAlign:'center' }} adjustsFontSizeToFit>
                                    01:00
                                </Text>
                                <Text></Text>
                            </View>
                        </View>

                        {/* Players */}
                        <View style={{flexDirection:'column', flex:1, justifyContent:'space-between', paddingHorizontal:12, marginBottom:8}}>
                            <View style={{width:'100%', borderRadius:16, backgroundColor: backgroungColor, alignItems:'center', justifyContent:'space-around', paddingVertical:8}}>
                                <View style={{backgroundColor:'transparent', width:'100%', paddingHorizontal:16, paddingVertical:14, flexDirection:'row', justifyContent:'space-between', borderWidth:0, borderColor:'red'}}>
                                    <Text style={{opacity:0.2, fontSize:16}}>Players</Text>
                                    <Text style={{opacity:0.2, fontSize:16}}>
                                        {data?.match.players.length} / {data?.match.max_players}
                                    </Text>
                                </View>
                                <View style={{backgroundColor:'transparent', borderWidth:0, borderColor:'red', width:'100%', paddingHorizontal:10}}>
                                    {
                                        playersQuery.data?.players.map((player, index) => (
                                            <View key={index} style={{backgroundColor:'transparent', marginBottom:16, flexDirection:'row'}}>
                                                <ProfilePicture uri={player.photo} />
                                                <View style={{backgroundColor:'transparent', justifyContent:'center', marginLeft:10, width:'65%'}}>
                                                    <Text style={{fontSize:18}}>{player.first_name} {player.last_name}</Text>
                                                    <Text style={{opacity:0.4}}>{ player.position }</Text>
                                                </View>
                                                <View style={{backgroundColor:'transparent', justifyContent:'center', marginLeft:10}}>
                                                    <View style={{backgroundColor:'#222222', borderRadius:12, paddingHorizontal:10, borderWidth:0, borderColor:'red', flex:1, justifyContent:'center'}}>
                                                        <Text style={{fontWeight:'600'}}> {player.rating ?? '0.0'} </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))
                                    }
                                    {
                                        playersQuery.data?.players.length === 0 &&
                                        <View style={{backgroundColor:'transparent', height:100, alignItems:'center', justifyContent:'center'}}>
                                            <Text style={{textAlign:'center', opacity:0.4, fontSize:16}}>Be the first to join</Text>
                                        </View>
                                    }
                                    {
                                        playersQuery.isLoading &&
                                        <ActivityIndicator size={40} color={'grey'} />
                                    }
                                </View>
                            </View>
                        </View>

                        {/* Description */}
                        <View style={{flexDirection:'row', flex:1, justifyContent:'space-between', paddingHorizontal:12, marginBottom:8}}>
                            <View style={{width:'49%', borderRadius:16, backgroundColor: backgroungColor, alignItems:'center', justifyContent:'space-around', paddingVertical:8}}>
                                <Text style={{opacity:0.2, fontSize:16, marginVertical:8}}>Organizer</Text>
                                <View style={{backgroundColor:'transparent', borderWidth:0, borderColor:'red', width:'100%', paddingHorizontal:10, alignItems:'center'}}>
                                    <ProfilePicture />
                                    <Text style={{fontSize:16, marginVertical:8}}>{data.match.organizer.first_name} {data.match.organizer.last_name}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height:68}}></View>
                    </ScrollView>
                    <SwipeButton 
                        type={swipeType}
                        onSwiped={() => setShowModal(true)} />
                    <View>
                        {
                            showModal &&
                                <BottomModal 
                                    transparent={true}
                                    visible={showModal}
                                    animationType='fade'
                                    modalHeight={'30%'}
                                    setVisible={() => setShowModal(false)}
                                >
                                    {
                                        joinMatchQuery.isPending ?
                                        <ActivityIndicator size={40} color={'grey'} />
                                        :
                                        <>
                                            <Button  onPress={() => setShowModal(false)}>
                                                <Text>
                                                    Close
                                                </Text>
                                            </Button>
                                            <Text>
                                                Modal content
                                            </Text>
                                            <Button onPress={() => handleJoinMatch()}>
                                                <Text>
                                                    Join
                                                </Text>
                                            </Button>
                                        </>
                                    }
                                </BottomModal>
                        }
                    </View>
                    </>
                }
        </View>
    );
};


const styles = StyleSheet.create({
    mapContainer: {
        height: 260,
        width: '100%',
        marginBottom: 10,
    },
    map: {
        height: '100%',
        width: '100%',
        borderRadius: 12,
    },
    paddingHorizontal:{
        paddingHorizontal: 12,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 20,
    }
});


export default Match;