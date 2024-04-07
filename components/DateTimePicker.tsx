import { TouchableOpacity, TextInput as DefaultTextInput, View as DefaultView } from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { View, TextInput, useThemeColor, Text } from '@/components/Themed';
import { useEffect, useRef, useState } from 'react';
import BottomModal from './BottomModal';
import Icon from './Icon';
import { formatDateToString } from '@/utils/formatDateToString';

interface DateTimePickerProps {
    value: Date
    placeholder?: string
    minimumDate?: Date
    maximumDate?: Date
    interval?: number
    type?: 'date' | 'time' | 'datetime' 
    DatePickerProps?: any
    editable?: boolean
    onChangeValue?: (value: Date) => void
}

const DateTimePicker = ( { type = 'date', placeholder, minimumDate, interval = 0, value, DatePickerProps, editable = true, onChangeValue }: DateTimePickerProps) => {
    
    const inputRef = useRef<DefaultTextInput>(null);
    const [ date, setDate ] = useState<Date>(value);
    const [ showDatePicker, setShowDatePicker ] = useState(false);
    const primaryColor = useThemeColor({}, 'primaryColor');
    const containerBackground = useThemeColor({}, 'itemBackground');

    useEffect(() => {
        setDate(value);
    }, [value])

    const formatValue = (value: Date) => {
        if(type === 'date'){
            return formatDateToString(value, 'dd/mm/yyyy');
        }else{
            return formatDateToString(value, 'hh:mm');
        }
    }

    const handleValueChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setDate(selectedDate!);
    }

    const handleOpen = () => {
        setShowDatePicker(true);
    }

    const handleClose = () => {
        setShowDatePicker(false);
        inputRef.current?.blur();
        onChangeValue && onChangeValue(date);
    }

    return (
        <View>
            <TextInput 
                innerRef={inputRef}
                containerStyle={{width:'100%'}}
                value={formatValue(date)} 
                placeholder={placeholder}
                style={{ opacity: editable ? 1 : 0.4 }}
                inputMode='none'
                selectTextOnFocus={false}
                selection={{start:0, end:0}}
                onTouchStart={handleOpen}
                editable={editable}
            />
            {
                showDatePicker && editable &&
                (
                    <BottomModal
                        duration={300}
                        modalHeight={ type === 'date' ? 360 : 200}
                        transparent
                        modalBackground={containerBackground}
                    >
                        <DefaultView style={{height:'100%', alignItems:'center', justifyContent:'center', paddingHorizontal:12, paddingVertical:8}}>
                            <DefaultView style={{width:'100%', justifyContent:'space-between', alignItems:'center', flexDirection:'row', paddingHorizontal:10}}>
                                <Text style={{fontWeight:'600', fontSize:16}}>Select {placeholder}</Text>
                                <Text style={{fontWeight:'600', fontSize:16}}></Text>
                                <TouchableOpacity onPress={handleClose} style={{height:35, width:35, alignItems:'center', borderRadius:100, justifyContent:'center', backgroundColor:primaryColor}}>
                                    <Icon name='check' size={20} color={'white'} />
                                </TouchableOpacity>
                            </DefaultView>
                            <RNDateTimePicker
                                value={date} 
                                mode={type}
                                minimumDate={minimumDate}
                                display={ type === 'date' ? 'inline' : 'spinner'}
                                accentColor={primaryColor}
                                style={{ backgroundColor: containerBackground, height:'90%', padding:4}}
                                onChange={(_event, selectedDate) => handleValueChange(_event, selectedDate)}
                                {...DatePickerProps}
                            />
                        </DefaultView>
                    </BottomModal>
                )
            }
        </View>
    );
};

export default DateTimePicker;