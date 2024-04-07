import { useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, View as DefaultView } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

import AddressInput from '@/components/AddressInput';
import DateTimePicker from '@/components/DateTimePicker';
import { View, TextInput, Text } from '@/components/Themed';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useForm } from '@/hooks/useForm';
import { useCancelMatch, useCreateMatch, useMatch, useUpdateMatch } from '@/hooks/useMatch';
import { formatTimeToDate } from '@/utils/formatTimeToDate';
import TopBarNavigator from '@/components/TopBarNavigator';
import { formatDateToString } from '@/utils/formatDateToString';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import BottomModal from '@/components/BottomModal';

const matchModal = () => {
    const router = useRouter();

    const [disabled, setDisabled] = useState(false);
    const [ error, setError ] = useState<string | undefined>(undefined);

    const [ showCancelModal, setShowCancelModal ] = useState(false);

    const { idMatch } = useLocalSearchParams<{ idMatch: string }>();
    const { user } = useContext(AuthContext);

    // Input refs
    const id = useRef<string | undefined>(undefined);

    const idAddress = useRef<string | undefined>(undefined);
    const location = useRef<string>('');
    const address = useRef<string>('');

    const date = useRef<Date>(new Date);
    const time = useRef<string>( `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`);
    const duration = useRef<string>('01:00');

    const { matchQuery } = useMatch(idMatch ?? undefined);

    const { description, maxPlayers, minPlayers, onChange } = useForm({
        description: matchQuery.data?.match.description || '',
        maxPlayers: matchQuery.data?.match.max_players || 0,
        minPlayers: matchQuery.data?.match.min_players || 0,
    });

    const { createMatchQuery } = useCreateMatch();
    const { updateMatchQuery } = useUpdateMatch();
    const { cancelMatchQuery } = useCancelMatch();
    const queryClient = useQueryClient();

    const goBack = () => {
        if(router.canGoBack()){
            router.back();
        }
        else{
            router.push('/(app)/(tabs)/');
        }
    }

    // Check if the user is the organizer of the match
    useFocusEffect(() => {
        if(matchQuery.data?.match.organizer && user?.id !== matchQuery.data?.match.organizer.id){
            goBack();
        }
    })

    useEffect(() => {
        if(matchQuery.data?.match.id){
            id.current = matchQuery.data?.match.id;
            location.current = matchQuery.data?.match.location;
            address.current = matchQuery.data?.match.address;

            date.current = new Date(matchQuery.data?.match.date);
            time.current = matchQuery.data?.match.time;
            duration.current = matchQuery.data?.match.duration;
        }
    }, [matchQuery.data?.match.id])

    useEffect(() => {
        if(location.current.trim() === '' || address.current.trim() === '' || minPlayers === 0 || maxPlayers === 0){
            setDisabled(true);
        }else{
            setDisabled(false);
        }

    }, [address, location, minPlayers, maxPlayers]);

    const handleAddressSelection = async (locationValue: string, addressValue:string, id: string) => {
        idAddress.current = id;
        location.current = locationValue;
        address.current = addressValue;
    }

    const handleSubmit = async () => {
        try{
            setError(undefined);
            // Format date and time
            const [ dateFormatted ] = date.current.toISOString().split('T');
            const dateMatch = new Date( `${dateFormatted}T${time.current}:00.000Z` );
            
            //Get the time offset, which is the difference between the local time and UTC time in milliseconds, and multiply it by -1 to get the UTC time
            const dateOffset = new Date().getTimezoneOffset() * 60000 * -1;

            // Check if the match is in the past
            if( dateMatch.getTime() < new Date().getTime() + dateOffset ){
                setError('Match is in the past');
                return;
            }

            if( duration.current === '00:00'){
                setError('Duration must be greater than 0');
                return;
            }

            // Check if the min players is less than the max players
            if(minPlayers > maxPlayers){
                setError('Min players must be less than max players');
                return;
            }

            if( !id.current ){
                await createMatchQuery.mutateAsync({
                    idAddress: idAddress.current, 
                    idOrganizer: user?.id!, 
                    location: location.current, 
                    address: address.current,
                    time: time.current,
                    date: date.current,
                    duration: duration.current,
                    description,
                    minPlayers,
                    maxPlayers
                });
            }else{
                await updateMatchQuery.mutateAsync({
                    id: id.current,
                    description,
                    minPlayers,
                    maxPlayers,
                    duration: duration.current
                });
                queryClient.refetchQueries({
                    queryKey:[`matches/[id]`, id.current],
                });
            }
            goBack();
        }
        catch(e){
            if(isAxiosError(e)){
                setError(e.response?.data.message.message);
            }
        }
    }

    const handleCancelMatch = async () => {
        try{
            await cancelMatchQuery.mutateAsync({ idMatch: idMatch! });
            queryClient.refetchQueries({
                queryKey:[`matches/[id]`, id.current],
            });
            router.back();
        }
        catch(e){
            if(isAxiosError(e)){
                setError(e.response?.data.message.message);
            }
            setShowCancelModal(false);
        }
    }

    return (
        <>
            <KeyboardAvoidingView style={{flex: 1, paddingHorizontal:12}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={180}>
                <View style={{paddingTop:4, flex:1}}>
                    <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={Keyboard.dismiss}> 
                    <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10, marginBottom:8}}>
                        <View style={{backgroundColor:'grey', opacity:0.4, borderRadius:18, width:100, height:5, marginBottom:8}}>
                        </View>
                        <TopBarNavigator title={id.current == undefined ? 'Create match' : 'Update match'} icon='check' activeColor disabled={disabled} action={handleSubmit}/>
                    </View>
                    <AddressInput 
                        editable={id.current == undefined}
                        value={ location.current != '' ? `${location.current}, ${address.current}`: ''} 
                        onChangeAddress={(location, address, idAddress) => handleAddressSelection(location, address, idAddress)} 
                    />
                    <TextInput
                        value={description}
                        onChangeText={(value) => onChange(value, 'description')}
                        placeholder="Description"
                    />
                    <View style={{width:'100%', flexWrap:'wrap', flexDirection:'row', justifyContent:'space-between'}}>
                        <TextInput
                            value={minPlayers == 0 ? undefined : minPlayers.toString()}
                            onChangeText={(value) => onChange(value, 'minPlayers')}
                            placeholder="Min players*"
                            selectTextOnFocus={true}
                            focusable={true}
                            containerStyle={{width:'48%'}}
                            inputMode="numeric"
                            keyboardType="numeric"
                        />
                        <TextInput
                            value={ maxPlayers == 0 ? undefined : maxPlayers.toString()}
                            onChangeText={(value) => onChange(value, 'maxPlayers')}
                            placeholder="Max players*"
                            selectTextOnFocus={true}
                            containerStyle={{width:'48%'}}
                            inputMode="decimal"
                        />
                    </View>
                    <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginVertical:8}}>
                        <View style={{ width:'47%' }}>
                            <DateTimePicker 
                                value={new Date(date.current)} 
                                type='date' 
                                minimumDate={new Date(date.current)} 
                                placeholder='Date*'
                                onChangeValue={(value) => ( date.current = value )}
                                editable={id.current == undefined}
                            />
                        </View>
                        <View style={{ width:'23%' }}>
                            <DateTimePicker 
                                value={formatTimeToDate(time.current)} 
                                type='time' 
                                placeholder='Time*' 
                                onChangeValue={(value) => ( time.current = formatDateToString(value, 'hh:mm'))}
                                editable={id.current == undefined}
                            />
                        </View>
                        <View style={{ width:'23%' }}>
                            <DateTimePicker 
                                DatePickerProps={{minuteInterval:15}} 
                                minimumDate={undefined} 
                                value={formatTimeToDate(duration.current)} 
                                type='time' 
                                placeholder='Duration*'
                                onChangeValue={(value) => (duration.current = formatDateToString(value, 'hh:mm'))}
                            />
                        </View>
                    </View>
                    {
                        id.current && 
                        <Text style={{opacity:0.7, fontSize:13}}>
                            Cannot update the location, time, or date of the game!
                        </Text>
                    }
                    {error && <Text style={{fontSize:15, color:'red', textAlign:'center', marginTop:8}}>{error}</Text>}
                    {
                        idMatch && Platform.OS === 'android' &&
                        <View style={{ marginTop:'50%', alignItems:'center', justifyContent:'center', width:'100%'}}>
                            <TouchableOpacity style={{ width:'80%', paddingVertical:12, backgroundColor:'rgba(255,0,0,0.6)', borderRadius:12 }} onPress={() => setShowCancelModal(true)}>
                                <Text style={{fontSize:16, textAlign:'center', fontWeight:'500', color:'white'}}>Cancel Match</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
                {
                    idMatch && Platform.OS === 'ios' &&
                    <View style={{ position:'absolute', bottom:60, alignItems:'center', justifyContent:'center', width:'100%'}}>
                        <TouchableOpacity style={{ width:'80%', paddingVertical:12, backgroundColor:'rgba(255,0,0,0.6)', borderRadius:12 }} onPress={() => setShowCancelModal(true)}>
                            <Text style={{fontSize:16, textAlign:'center', fontWeight:'500', color:'white'}}>Cancel Match</Text>
                        </TouchableOpacity>
                    </View>
                }
            {
                showCancelModal &&
                <BottomModal
                    transparent
                    allowDragDownToClose
                >
                    <DefaultView style={{flex:1, paddingVertical:8, paddingHorizontal:18, flexDirection:'column', justifyContent:'space-between', }}>
                        <Text></Text>
                        <Text style={{fontSize:16, paddingHorizontal:4, fontWeight:'600', textAlign:'center', marginBottom:8}}>
                            Are you sure you want to cancel the match?
                        </Text>
                        <DefaultView style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <TouchableOpacity style={{padding:8, backgroundColor:'rgba(0,0,0,0.5)', borderRadius:8, width:'48%', alignItems:'center'}} onPress={() => setShowCancelModal(false)}>
                                <Text style={{color:'white', fontSize:16}}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{padding:8, backgroundColor:'rgba(255,0,0,0.5)', borderRadius:8, width:'48%', alignItems:'center'}} onPress={handleCancelMatch}>
                                <Text style={{color:'white', fontSize:16}}>Cancel</Text>
                            </TouchableOpacity>
                        </DefaultView>
                    </DefaultView>
                </BottomModal>
            }
        </>
    );
};

export default matchModal;