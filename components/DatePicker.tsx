import { StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import { useWeekdays } from '@/hooks/useWeekdays';
import Colors from '@/constants/Colors';
import { useThemeColor } from '@/components/Themed';

const DatePicker = () => {

    const { dayList, selectedDate, setSelectedDate } = useWeekdays();

    const selectionBackground = useThemeColor({}, 'selectionBackground');

    return (
        <ScrollView 
            style={styles.container}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {
                dayList.map((day, index) => {
                    const selected = selectedDate?.fullDate === day.fullDate;
                    return (
                        // Date Button
                        <TouchableOpacity 
                            key={index}
                            style={{...styles.dateListItem, backgroundColor: selected ? selectionBackground : 'transparent'}}
                            activeOpacity={0.8}
                            onPress={() => setSelectedDate(day)}
                        >

                            {/* day */}
                            <Text style={[styles.day, , selected && styles.daySelected]}>
                                {day.day}
                            </Text>

                            {/* date */}
                            <Text style={[styles.date, selected && styles.dateSelected]}>
                                {day.date}
                            </Text>
                        </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {

    },
    dateListItem: {
        width: 55,
        height: 55,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    day: {
        fontSize: 12,
        fontWeight: '500',
    },
    daySelected: {
        fontSize: 13,
        fontWeight: '600',
    },
    date: {
        fontSize: 18,
        fontWeight: '500',
    },
    dateSelected: {
        fontSize: 19,
        fontWeight: '600',
    },
});

export default DatePicker;