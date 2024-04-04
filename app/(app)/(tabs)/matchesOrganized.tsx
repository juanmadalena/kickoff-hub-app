import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View as DefaultView, StyleSheet, Animated, Easing, SectionList } from 'react-native';

import { View, Text, Button, useThemeColor } from '@/components/Themed';
import { useMatchesOrganized } from '@/hooks/useMatches';
import BottomModal from '@/components/BottomModal';
import LoadingComponent from '@/components/LoadingComponent';
import MatchItem from '@/components/MatchItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopBarNavigator from '@/components/TopBarNavigator';
import { useRouter } from 'expo-router';
import FiltersComponent from '@/components/FiltersComponent';
import { showOptions, orderOptions, Match } from '@/interfaces';
import { filterMatches } from '@/utils/filterMatches';
import TitleSectionList from '@/components/TitleSectionList';

const matchesOrganized = () => {

    const [ showNewMatchModal, setShowNewMatchModal ] = useState<boolean>(false);

    const { matchesOrganizedQuery } = useMatchesOrganized();
    const { bottom } = useSafeAreaInsets();
    const [ filteredData, setFilteredData ] = useState<any[]>([])

    const router = useRouter();

    const buttonColor = useThemeColor({}, 'secondaryColor');

    if(matchesOrganizedQuery.isLoading) {
        return( 
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <LoadingComponent />
        </View>)
    };

    const changeFilter = (filter: keyof typeof showOptions, group: keyof Match , order: keyof typeof orderOptions ) => {
        const filtered = filterMatches({matches: matchesOrganizedQuery.data?.matches!, filter, group, order})        
        setFilteredData(filtered)
    }


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

    return (
        <>
            <View style={{height:'100%'}}>
                <FiltersComponent color='#004759' changeFilter={changeFilter} />
                {
                    matchesOrganizedQuery.isSuccess && filteredData && filteredData?.length > 0 &&
                    <SectionList
                        sections={filteredData}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={matchesOrganizedQuery.refetch}/>}
                        renderItem={({ item }) => <MatchItem match={item} checkMatches={false} cardColor='#004759' /> }
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        style={{paddingHorizontal: 10, flex:1, height:'100%'}}
                        contentContainerStyle={{paddingBottom: 130}}
                        ListEmptyComponent={
                            <Text style={{textAlign:'center', fontSize: 16, fontWeight: '600', marginTop:'40%'}}> 
                                No matches found 😞
                            </Text>
                        }
                        renderSectionHeader={ ( {section} ) => (
                            <TitleSectionList title={section.title} />
                        )}
                    />
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