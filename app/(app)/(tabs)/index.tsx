import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import { View, Text } from '@/components/Themed';
import DatePicker from '@/components/DatePicker';
import MatchItem from '@/components/MatchItem';
import { useMatches } from '@/hooks/useMatches';
import { formatDateToString } from '@/utils/formatDateToString';
import { checkIfMatchIsAvailable } from '@/utils/checkIfMatchIsAvailable';
import { useFocusEffect } from 'expo-router';
import LoadingComponent from '@/components/LoadingComponent';

const index = () => {

    const [ selectedDate, setSelectedDate ] = useState<Date>(new Date());
    const { matchesQuery: { data, isLoading, isError, refetch } } = useMatches(formatDateToString(selectedDate));
    const [ firstMatchAvailable, setFirstMatchAvailable ] = useState<number>(0);

    const handleDateChange = (date: Date) => {
        return setSelectedDate(date);
    }

    // Iterate through matches and get first match available
    const getFirstMatchAvailable = () => {
        for(let i = 0; i < data?.matches?.length!; i++) {
            if(checkIfMatchIsAvailable(data?.matches[i]) === 'join') {
                setFirstMatchAvailable(i);
                break;
            }
        }
    }

    // Refetch on focus
    useFocusEffect(()=>{
        refetch();
    })

    // Get first match available on data change
    useEffect(() => {
        getFirstMatchAvailable();
    }, [data])

    return (
        <View style={styles.container}>
            
            {/* Date picker */}
            <View style={[styles.marginBottom, styles.paddingHorizontal]}>
                <DatePicker onStateChange={handleDateChange}/>
            </View>

            {/* Matches list */}
            {
                isLoading ? 
                <LoadingComponent/>
                :
                <FlatList
                    refreshControl={<RefreshControl refreshing={false} onRefresh={refetch}/>}
                    data={data?.matches}
                    renderItem={({item}) => <MatchItem match={item} />}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    style={styles.matchesList}
                    ListEmptyComponent={ 
                        <Text style={{textAlign:'center', fontSize: 16, fontWeight: '600', marginTop:'40%'}}> 
                            No matches found😔 
                        </Text>
                    }
                />
            }
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