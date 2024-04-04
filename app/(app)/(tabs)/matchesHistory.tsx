import { useState } from 'react';
import { RefreshControl, SectionList } from 'react-native';
import { useFocusEffect } from 'expo-router';

import MatchItem from '@/components/MatchItem';
import { View, Text, useThemeColor } from '@/components/Themed';
import { useMatchesPlayed } from '@/hooks/useMatches';
import LoadingComponent from '@/components/LoadingComponent';
import TopBarNavigator from '@/components/TopBarNavigator';
import FiltersComponent from '@/components/FiltersComponent';
import { filterMatches } from '@/utils/filterMatches';
import TitleSectionList from '@/components/TitleSectionList';
import { Match, orderOptions, showOptions } from '@/interfaces';

const matchesHistory = () => {

    const { matchesPlayedQuery } = useMatchesPlayed();

    const [ filteredData, setFilteredData ] = useState<any[]>([])

    const cardColor = useThemeColor({}, 'playedColor')

    useFocusEffect(() => {
        matchesPlayedQuery.refetch();
    });

    const changeFilter = (filter: keyof typeof showOptions, group: keyof Match , order: keyof typeof orderOptions ) => {
        if(!matchesPlayedQuery.isSuccess) return;
        const filtered = filterMatches({matches: matchesPlayedQuery.data?.matches!, filter, group, order})
        setFilteredData(filtered)
    }

    if(matchesPlayedQuery.isLoading) {
        return <LoadingComponent/>
    }

    if(matchesPlayedQuery.isError) {
        return (
            <View>
                <TopBarNavigator />
                <View style={{flex:1, width:'100%', justifyContent:'center', alignItems:'center'}}>
                    <Text>
                        There was an error 😞
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{flex:1}}>
            <FiltersComponent color={cardColor} changeFilter={changeFilter} marginBottom={12} />
            {
                matchesPlayedQuery.isSuccess && filteredData && filteredData?.length > 0 &&
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
                            <Text style={{textAlign:'center', fontSize: 16, fontWeight: '600', marginTop:'40%'}}> 
                                No matches found 😞
                            </Text>
                        }
                        renderSectionHeader={({section: {title}}) => (
                            <TitleSectionList title={title} />
                        )}
                    />
            }
        </View>
    );
};

export default matchesHistory;