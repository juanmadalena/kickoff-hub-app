import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@/components/DateTimePicker';

import { Match } from '@/interfaces';
import { Text, TextInput } from '@/components/Themed';
import { useForm } from '@/hooks/useForm';
import AddressInput from './AddressInput';

interface CreateUpdateMatchProps {
    match?: Match
}

const CreateUpdateMatch = ({ match }: CreateUpdateMatchProps) => {

    const { id, description, min_players, max_players, onChange, form} = useForm<Match>(
        {
            id: match?.id || '',
            date: match?.date || '',
            time: match?.time || '',
            location: match?.location || '',
            description: match?.description || '',
            max_players: match?.max_players || 0,
            min_players: match?.min_players || 0,
            players: match?.players || [],
            organizer: match?.organizer || undefined,
            duration: match?.duration || '0',
            latitude: match?.latitude || 0,
            longitude: match?.longitude || 0,
            num_players: match?.num_players || 0,
            price: match?.price || 0,
        }
    )

    const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        if(Platform.OS === 'android'){
            const date = selectedDate?.toISOString().split('T')[0];
            console.log(selectedDate);
        }else{
            const date = selectedDate?.toISOString().split('T');
            const time = date?.at(1)?.slice(0,5);
            console.log(date?.at(0), time);
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1, paddingHorizontal:12}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={180}>
            <AddressInput onChangeAddress={(location) => onChange(location, 'location')} />
            <TextInput
                value={description}
                onChangeText={(value) => onChange(value, 'description')}
                placeholder="Description"
            />
            <View style={{width:'100%', flexWrap:'wrap', flexDirection:'row', justifyContent:'space-between'}}>
                <TextInput
                    value={min_players.toString()}
                    onChangeText={(value) => onChange(value, 'min_players')}
                    placeholder="Min players*"
                    containerStyle={{width:'48%'}}
                    inputMode="numeric"
                    keyboardType="numeric"
                    onSubmitEditing={() => console.log('submitted')}
                />
                <TextInput
                    value={max_players.toString()}
                    onChangeText={(value) => onChange(value, 'max_players')}
                    placeholder="Max players*"
                    containerStyle={{width:'48%'}}
                    inputMode="decimal"
                />
            </View>
            <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginVertical:8}}>
                <View style={{ width:'33%' }}>
                    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                        <DateTimePicker />
                        {/* <DateTimePicker 
                            style={{ width: Platform.OS == 'android' ? '49%' : '100%', height: 50, padding:10}} 
                            value={new Date()} 
                            minimumDate={new Date()} 
                            mode={Platform.OS == 'android' ? 'date' : 'datetime'}
                            display='compact'
                            onChange={handleDateChange}                            
                            />
                        {
                            Platform.OS == 'android' &&
                            <DateTimePicker style={{ width: Platform.OS == 'android' ? '49%' : '49%', height: 50, padding:10}} value={new Date('2024-03-03 01:00:00')} minimumDate={new Date()} mode='time' display='compact'/>
                        } */}
                    </View>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', width:'33%'}}>
                    <DateTimePicker type='time' />
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', width:'33%'}}>
                    <DateTimePicker type='time' />
                </View>
                {/* <View style={{marginVertical:8, width:'48%'}}>
                    <Text style={{fontSize: 14, fontWeight:'500', marginBottom: 2, marginLeft:1, opacity: 0.5}}>Duration*</Text>
                    <DateTimePicker style={{ width:'100%', height: 50, padding:10}} value={new Date('2024-03-03 01:00:00')} minuteInterval={15} mode='time' display='compact'/>
                </View> */}
            </View>
        </KeyboardAvoidingView>
    );
};

export default CreateUpdateMatch;