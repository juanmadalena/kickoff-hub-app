import { StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useWeekdays } from '@/hooks/useWeekdays';
import { useThemeColor } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { formatDateToString } from '@/utils/formatDateToString';


interface DatePickerProps {
    initialDate?: Date;
    onStateChange?: (date: Date) => void;
}

const DatePicker = ( {  initialDate = new Date(), onStateChange = () => null }:DatePickerProps ) => {
    
    const [ selectedDate, setSelectedDate ] = useState<string>(formatDateToString(initialDate));
    const { dayList } = useWeekdays(initialDate);
    
    const selectionBackground = useThemeColor({}, 'selectionBackground');
    const background = useThemeColor({}, 'itemBackground');

    const navigation = useNavigation();

    const handleChange = (date: string) => {

        setSelectedDate(date);
        onStateChange(new Date(date));
    }

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                onTouchStart={() => navigation.setOptions({ swipeEnabled: false })}
                onTouchEnd={() => navigation.setOptions({ swipeEnabled: true })}
                onScrollBeginDrag={() => navigation.setOptions({ swipeEnabled: false })}
                onScrollEndDrag={() => navigation.setOptions({ swipeEnabled: true })}
            >
                {
                    dayList.map((day, index) => {
                        const selected = selectedDate === day.fullDate;

                        return (
                            // Date Button
                            <TouchableOpacity 
                                key={index}
                                style={{...styles.dateListItem, backgroundColor: selected ? selectionBackground : 'transparent'}}
                                activeOpacity={0.8}
                                onPress={() => handleChange(day.fullDate)}
                            >

                                {/* day */}
                                <Text style={[ selected ? styles.daySelected : styles.day]}>
                                    {day.day}
                                </Text>

                                {/* date */}
                                <Text style={[selected ? styles.dateSelected : styles.date]}>
                                    {day.date}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        paddingVertical: 8,
        paddingHorizontal:6, 
        borderRadius:16
    },
    dateListItem: {
        width: 55,
        height: 55,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    day: {
        opacity: 0.2,
        fontSize: 12,
        fontWeight: '500',
    },
    daySelected: {
        fontSize: 13,
        fontWeight: '600',
    },
    date: {
        opacity: 0.2,
        fontSize: 18,
        fontWeight: '400',
    },
    dateSelected: {
        fontSize: 19,
        fontWeight: '500',
    },
});

export default DatePicker;