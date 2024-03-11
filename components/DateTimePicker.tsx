import { Text, Platform, Modal } from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { View, TextInput, useThemeColor, Button } from './Themed';
import { useRef, useState } from 'react';
import BottomModal from './BottomModal';

interface DateTimePickerProps {
    placeholder?: string
    minimumDate?: Date
    maximumDate?: Date
    interval?: number
    type?: 'date' | 'time' | 'datetime'
    onChange?: (event: DateTimePickerEvent, selectedDate: Date | undefined) => void
}

const DateTimePicker = ( { type = 'date' }: DateTimePickerProps) => {

    const inputRef = useRef<typeof RNDateTimePicker>(null);
    const [ date, setDate ] = useState(new Date());
    const [ showDatePicker, setShowDatePicker ] = useState(false);
    const primaryColor = useThemeColor({}, 'primaryColor');
    const backgroundColor = useThemeColor({}, 'itemBackground');

    const handle = () => {
        if(inputRef.current){
            console.log(inputRef.current);
        }else{
            console.log('no ref');
        }
    }

    return (
        <View>
            {/* <TextInput 
                containerStyle={{width:'100%'}}
                value={date.toLocaleDateString()} 
                placeholder='Date*' 
                inputMode='none'
                onFocus={() => setShowDatePicker(true)}
                onBlur={() => setShowDatePicker(false)}
            /> */}
            <RNDateTimePicker
                // ref={inputRef}
                value={date} 
                minimumDate={new Date()} 
                mode={type}
                display='default'
                accentColor={primaryColor}
                collapsable={true}
                style={{ height:50, backgroundColor, borderRadius:8, borderWidth:1, borderColor:'red'}}
                onChange={(_event, _selectedDate) => { handle()}}
            />
        </View>
    );
};

export default DateTimePicker;