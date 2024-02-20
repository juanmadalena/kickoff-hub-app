import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { View, Text } from '@/components/Themed';
import DatePicker from '@/components/DatePicker';
import MatchItem from '@/components/MatchItem';
import { useMatches } from '@/hooks/useMatches';
import { formatDateToString } from '@/utils/formatDateToString';

const index = () => {

    const [ selectedDate, setSelectedDate ] = useState<Date>(new Date('2024-02-17'));
    const { matchesQuery: { data, isLoading, isError } } = useMatches(formatDateToString(selectedDate));
    
    const handleDateChange = (date: Date) => {
        return setSelectedDate(date);
    }

    return (
        <View style={styles.container}>
            
            {/* Date picker */}
            <View style={[styles.marginBottom, styles.paddingHorizontal]}>
                <DatePicker onStateChange={handleDateChange}/>
            </View>

            {/* Matches list */}
            {
                isLoading ? 
                <View style={{height:'40%', alignContent:'center', justifyContent:'center'}}>
                    <ActivityIndicator size="large" color="grey" />
                </View>
                :
                
                data?.matches?.length === 0 || isError ?
                <View style={{height:'40%', alignContent:'center', justifyContent:'center'}}>
                    <Text style={{textAlign:'center', fontSize: 16, fontWeight: '600'}}>
                        No matches found😔
                    </Text>
                </View>
                :
                <FlatList
                    data={data?.matches}
                    renderItem={({item}) => <MatchItem  match={item}/>}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    style={styles.matchesList}
                />
            }
            <View style={{position: 'absolute', bottom:0, width: '100%', backgroundColor:'transparent', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                {/* <View > */}
                    {/* <Text style={{padding:12, borderWidth:1, textAlign:'center', width:120, backgroundColor:'teal', borderRadius:12, color:'white'}}>
                        New Match
                    </Text> */}
                {/* </View> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height:'100%', 
        flex:1,
    },
    marginBottom: {
        marginBottom: 12,
    },
    paddingHorizontal: {
        paddingHorizontal: 12,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        textAlign: 'left',
    },
    matchesList: {
        paddingHorizontal: 10,
        flex: 1,
    }
})

export default index;