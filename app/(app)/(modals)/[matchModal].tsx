import AddressInput from '@/components/AddressInput';
import DateTimePicker from '@/components/DateTimePicker';
import { View, TextInput, Text } from '@/components/Themed';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useForm } from '@/hooks/useForm';
import { useCreateMatch, useMatch } from '@/hooks/useMatch';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { formatTimeToDate } from '@/utils/formatTimeToDate';
import TopBarNavigator from '@/components/TopBarNavigator';
import { formatDateToString } from '@/utils/formatDateToString';

const matchModal = () => {
    const router = useRouter();

    const [disabled, setDisabled] = useState(false);

    const { idMatch } = useLocalSearchParams<{ idMatch: string }>();
    const { user } = useContext(AuthContext);

    // Input refs
    const id = useRef<string | undefined>(undefined);

    const idAddress = useRef<string | undefined>(undefined);
    const location = useRef<string>('');
    const address = useRef<string>('');

    const date = useRef<Date>(new Date());
    const time = useRef<string>('00:00');
    const duration = useRef<string>('01:00');

    const { matchQuery } = useMatch(idMatch ?? undefined);

    const { description, maxPlayers, minPlayers, onChange } = useForm({
        description: matchQuery.data?.match.description || '',
        maxPlayers: matchQuery.data?.match.max_players || 0,
        minPlayers: matchQuery.data?.match.min_players || 0,
    });

    const { createMatchQuery } = useCreateMatch();

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

    const handleSubmit = () => {
        createMatchQuery.mutateAsync({
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
        goBack();
    }

    return (
        <KeyboardAvoidingView style={{flex: 1, paddingHorizontal:12}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={180}>
            <View style={{paddingTop:4, flex:1}}>
                <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={Keyboard.dismiss}> 
                <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10, marginBottom:8}}>
                    <View style={{backgroundColor:'grey', opacity:0.4, borderRadius:18, width:100, height:5, marginBottom:8}}>
                    </View>
                    <TopBarNavigator title={id.current == undefined ? 'Create match' : 'Update match'} icon='check' activeColor disabled={disabled} action={handleSubmit}/>
                </View>
                <AddressInput 
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
                        />
                    </View>
                    <View style={{ width:'23%' }}>
                        <DateTimePicker 
                            minimumDate={ matchQuery.data?.match.date ? new Date(matchQuery.data?.match.date) : new Date()} 
                            value={formatTimeToDate(time.current)} 
                            type='time' 
                            placeholder='Time*' 
                            onChangeValue={(value) => ( time.current = formatDateToString(value, 'hh:mm'))}
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
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default matchModal;