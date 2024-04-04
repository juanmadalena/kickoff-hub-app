import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, SectionList, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import MatchItem from '@/components/MatchItem';
import { View, Text, useThemeColor } from '@/components/Themed';
import { useMatchesPlayed } from '@/hooks/useMatches';
import LoadingComponent from '@/components/LoadingComponent';
import TopBarNavigator from '@/components/TopBarNavigator';
import FiltersComponent from '@/components/FiltersComponent';
import { filterMatches } from '@/utils/filterMatches';
import TitleSectionList from '@/components/TitleSectionList';
import { Match, MatchFiltered, orderOptions, showOptions } from '@/interfaces';

const matchesHistory = () => {

    const { matchesPlayedQuery } = useMatchesPlayed();

    const cardColor = useThemeColor({}, 'playedColor')

    const [ order, setOrder ] = useState<keyof typeof orderOptions>('ASCENDING');
    const [ groupBy, setGroupBy ] = useState<keyof Match>('date');
    const [ filter, setFilter ] = useState<keyof typeof showOptions>('ALL');

    useFocusEffect(() => {
        matchesPlayedQuery.refetch();
    });

    const resetFilters = () => {
        setOrder('ASCENDING');
        setGroupBy('date');
        setFilter('ALL');
    }

    const changeFilter = (filter: keyof typeof showOptions, group: keyof Match , order: keyof typeof orderOptions ) => {
        setOrder(order);
        setGroupBy(group);
        setFilter(filter);
    }

    const filteredData: any[] = useMemo(() => {
        if(matchesPlayedQuery.isSuccess) {
            return filterMatches({matches: matchesPlayedQuery.data?.matches!, filter, group: groupBy, order})
        }
        return []
    }, [matchesPlayedQuery.data, filter, groupBy, order])

    if(matchesPlayedQuery.isLoading) {
        return <LoadingComponent/>
    }

    if(matchesPlayedQuery.isError) {
        return (
            <View>
                <TopBarNavigator />
                <View style={{flex:1, width:'100%', justifyContent:'center', alignItems:'center'}}>
                    <Text>
                        There was an error 😞, Try again later.
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{flex:1}}>
            {
                matchesPlayedQuery.isSuccess && filteredData && matchesPlayedQuery.data.matches.length > 0 &&
                <>
                    <FiltersComponent  
                        order={order}
                        groupBy={groupBy}
                        filter={filter}
                        color={cardColor} 
                        changeFilter={changeFilter} 
                    />
                    <SectionList
                        sections={filteredData}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={matchesPlayedQuery.refetch}/>}
                        renderItem={({item}) => <MatchItem match={item} checkMatches={false} cardColor={cardColor} />}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        style={{paddingHorizontal: 10, flex:1}}
                        contentContainerStyle={{paddingBottom: 50}}
                        getItemLayout={(_, index) => ({length: 135, offset: 135 * index, index})}
                        ListEmptyComponent={
                            <>
                                <Text style={{textAlign:'center', fontSize: 16, fontWeight: '600', marginTop:'40%'}}> 
                                    No matches found 😞
                                </Text>
                                <TouchableOpacity onPress={resetFilters}>
                                    <Text style={{textAlign:'center', fontSize: 14, fontWeight: '600', marginTop:12}}>
                                        Reset your filters!
                                    </Text>
                                </TouchableOpacity>
                            </>
                        }
                        renderSectionHeader={({section: {title}}) => (
                            <TitleSectionList title={title} />
                        )}
                    />
                </>
            }
            {
                filteredData.length === 0 && matchesPlayedQuery.isSuccess && matchesPlayedQuery.data.matches.length === 0 &&
                <View style={{height:'80%', justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity
                    activeOpacity={0.8} 
                    onPress={() => router.navigate({
                    pathname:'/(app)/(tabs)/',
                })}>
                    <Text style={{textAlign:'center', fontSize: 16, fontWeight: '600'}}> 
                        Join your first match! 😎
                    </Text>
                </TouchableOpacity>
            </View>
            }
        </View>
    );
};

export default matchesHistory;