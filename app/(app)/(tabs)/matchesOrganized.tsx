import { useMemo, useState } from 'react';
import { RefreshControl, View as DefaultView, StyleSheet, Animated, Easing, SectionList, Touchable, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { View, Text, Button, useThemeColor } from '@/components/Themed';
import { useMatchesOrganized } from '@/hooks/useMatches';
import BottomModal from '@/components/BottomModal';
import LoadingComponent from '@/components/LoadingComponent';
import MatchItem from '@/components/MatchItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopBarNavigator from '@/components/TopBarNavigator';
import FiltersComponent from '@/components/FiltersComponent';
import { showOptions, orderOptions, Match } from '@/interfaces';
import { filterMatches } from '@/utils/filterMatches';
import TitleSectionList from '@/components/TitleSectionList';

const matchesOrganized = () => {

    const [ showNewMatchModal, setShowNewMatchModal ] = useState<boolean>(false);

    const { matchesOrganizedQuery } = useMatchesOrganized();
    const { bottom } = useSafeAreaInsets();

    const [ order, setOrder ] = useState<keyof typeof orderOptions>('ASCENDING');
    const [ groupBy, setGroupBy ] = useState<keyof Match>('date');
    const [ filter, setFilter ] = useState<keyof typeof showOptions>('ALL');

    const buttonColor = useThemeColor({}, 'secondaryColor');
    const cardColor = useThemeColor({}, 'organizedColor')

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
        if(matchesOrganizedQuery.isSuccess) {
            return filterMatches({matches: matchesOrganizedQuery.data?.matches!, filter, group: groupBy, order})
        }
        return []
    }, [matchesOrganizedQuery.data, filter, groupBy, order])


    // Animation rotate loop
    const spinValue = new Animated.Value(0);
    Animated.loop(
        Animated.timing(
            spinValue,
            {
                toValue: 1,
                duration: 2800,
                useNativeDriver: true,
                isInteraction: false,
                delay: 0,
                easing: Easing.linear
            }
        )
    ).start();

    //interpolalte the value of spinValue
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    if(matchesOrganizedQuery.isLoading) {
        return( 
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <LoadingComponent />
        </View>)
    };

    if(matchesOrganizedQuery.isError) {
        return (
            <View>
                <View style={{flex:1, width:'100%', justifyContent:'center', alignItems:'center'}}>
                    <Text>
                        There was an error! 😞, try again later.
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <>
            <View style={{height:'100%'}}>
                {
                    matchesOrganizedQuery.isSuccess && filteredData && matchesOrganizedQuery.data.matches.length > 0 &&
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
                            refreshControl={<RefreshControl refreshing={false} onRefresh={matchesOrganizedQuery.refetch}/>}
                            renderItem={({ item }) => <MatchItem match={item} checkMatches={false} cardColor={cardColor} /> }
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            style={{paddingHorizontal: 10, flex:1, height:'100%'}}
                            contentContainerStyle={{paddingBottom: 130}}
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
                            renderSectionHeader={ ( {section} ) => (
                                <TitleSectionList title={section.title} />
                            )}
                        />
                    </>
                }
                {
                    matchesOrganizedQuery.isSuccess && matchesOrganizedQuery.data.matches.length == 0 &&
                    filteredData && filteredData?.length === 0 &&
                    <View style={{height:'80%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity
                            activeOpacity={0.8} 
                            onPress={() => router.navigate({
                            pathname:'/(app)/(modals)/[matchModal]',
                            params: { matchModal: false }
                        })}>
                            <Text style={{textAlign:'center', fontSize: 16, fontWeight: '600'}}> 
                                Organize your first match! 🎉
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                <DefaultView style={{position:'absolute', bottom: bottom, left:'30%', right:'30%'}} >
                    <Button 
                        activeOpacity={0.8}
                        style={[styles.boxWithShadow,{alignItems:'center', justifyContent:'center', flexDirection: 'row', height:40, borderRadius:40, backgroundColor:buttonColor}]} 
                        onPress={() => router.navigate({
                        pathname:'/(app)/(modals)/[matchModal]',
                        params: { matchModal: false }
                        })} >
                        <Text style={{ fontWeight:'700', textAlign:'center', color:'white' }}>
                            New Match
                        </Text>
                        <Animated.Text style={{marginLeft:6, transform:[{rotateZ:spin}]}}>
                            ⚽
                        </Animated.Text>
                    </Button>
                </DefaultView>
            </View>
            {
                showNewMatchModal &&
                <>
                    <BottomModal
                        visible={true}
                        modalHeight={'92%'}
                        duration={300}
                        transparent={true}
                        setVisible={() => setShowNewMatchModal(false)}
                        allowDragDownToClose={true}
                    >
                        <TopBarNavigator goBackAction={() => router.back()} icon='check' activeColor   />
                    </BottomModal>
                </>
            }
        </>
    );
};

const styles = StyleSheet.create({
    boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,  
        elevation: 5
    }
})

export default matchesOrganized;