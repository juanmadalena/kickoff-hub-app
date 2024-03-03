import { SectionList } from 'react-native';
import { useFocusEffect } from 'expo-router';

import MatchItem from '@/components/MatchItem';
import { View, Text } from '@/components/Themed';
import { useMatchesPlayed } from '@/hooks/useMatches';
import { formatDateToString } from '@/utils/formatDateToString';
import LoadingComponent from '@/components/LoadingComponent';

const matchesHistory = () => {

    const { matchesPlayedQuery } = useMatchesPlayed();

    useFocusEffect(() => {
        matchesPlayedQuery.refetch();
    });


    return (
        <View style={{flex:1}}>
            {
                matchesPlayedQuery.isLoading && <LoadingComponent/>
            }
            {
                matchesPlayedQuery.isError && <Text>Error</Text>
            }
            {
                matchesPlayedQuery.isSuccess && 
                    <SectionList
                        sections={matchesPlayedQuery.data?.matches}
                        renderItem={({item, index}) => <MatchItem match={item} index={index} checkMatches={false}/>}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        style={{paddingHorizontal: 10, flex:1}}
                        getItemLayout={(_, index) => ({length: 135, offset: 135 * index, index})}
                        renderSectionHeader={({section: {title}}) => (
                            <View>
                                <Text style={{fontSize: 14, paddingLeft:10, paddingVertical:10, color:'grey', fontWeight: '600'}}>{formatDateToString(title)}</Text>
                            </View>
                        )}
                    />
            }
        </View>
    );
};

export default matchesHistory;