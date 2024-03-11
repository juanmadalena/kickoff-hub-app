import AddressInput from '@/components/AddressInput';
import DateTimePicker from '@/components/DateTimePicker';
import { View, Text, TextInput } from '@/components/Themed';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useForm } from '@/hooks/useForm';
import { useMatch } from '@/hooks/useMatch';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { formatTimeToDate } from '@/utils/formatTimeToDate';

const matchModal = () => {

    const { matchModal : idMatch} = useLocalSearchParams<{ matchModal: string }>();
    const { user } = useContext(AuthContext);

    const { matchQuery } = useMatch(idMatch ?? undefined);

    const { form, onChange } = useForm({
        id: matchQuery.data?.match.id || '',
        date: matchQuery.data?.match.date || new Date(),
        time: matchQuery.data?.match.time || '00:00',
        location: matchQuery.data?.match.location || '',
        description: matchQuery.data?.match.description || '',
        max_players: matchQuery.data?.match.max_players || 0,
        min_players: matchQuery.data?.match.min_players || 0,
        organizer: user?.id!,
        duration: matchQuery.data?.match.duration || '01:00',
    })

    // useEffect(() => {
    //     console.log('match: ', idMatch ?? 'epa');
    //     console.log('user', user?.id);
    // }, [idMatch]);
    
    return (
        <KeyboardAvoidingView style={{flex: 1, paddingHorizontal:12}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={180}>
            <View style={{paddingTop:4, flex:1}}>
                <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10, marginBottom:8}}>
                    <View style={{backgroundColor:'grey', opacity:0.4, borderRadius:18, width:100, height:5, marginBottom:8}}>
                    </View>
                    <Text style={{textAlign:'left', width:'100%', paddingHorizontal:4, marginVertical:8, fontSize:24}}>
                        {
                            form.id === '' ? 'Create a match' : 'Update match'
                        }
                    </Text>
                </View>
                <AddressInput value={form.location} onChangeAddress={(value) => onChange(value, 'location')} />
                <TextInput
                    value={form.description}
                    onChangeText={(value) => onChange(value, 'description')}
                    placeholder="Description"
                />
                <View style={{width:'100%', flexWrap:'wrap', flexDirection:'row', justifyContent:'space-between'}}>
                    <TextInput
                        value={form.min_players.toString()}
                        onChangeText={(value) => onChange(value, 'min_players')}
                        placeholder="Min players*"
                        containerStyle={{width:'48%'}}
                        inputMode="numeric"
                        keyboardType="numeric"
                        onSubmitEditing={() => console.log('submitted')}
                    />
                    <TextInput
                        value={form.max_players.toString()}
                        onChangeText={(value) => onChange(value, 'max_players')}
                        placeholder="Max players*"
                        containerStyle={{width:'48%'}}
                        inputMode="decimal"
                    />
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginVertical:8}}>
                    <View style={{ width:'47%'}}>
                        <DateTimePicker value={new Date(form.date)} type='date' minimumDate={new Date(form.date)} placeholder='Date*'/>
                    </View>
                    <View style={{ width:'23%' }}>
                        <DateTimePicker minimumDate={new Date()} value={formatTimeToDate(form.time)} type='time' placeholder='Time*'/>
                    </View>
                    <View style={{ width:'23%' }}>
                        <DateTimePicker DatePickerProps={{minuteInterval:15}} minimumDate={undefined} value={formatTimeToDate(form.duration)} type='time' placeholder='Duration*'/>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default matchModal;