import { useState } from 'react';
import { FlatList, RefreshControl, View as DefaultView } from 'react-native';

import { View, Text, Button } from '@/components/Themed';
import { useMatchesOrganized } from '@/hooks/useMatches';
import BottomModal from '@/components/BottomModal';
import LoadingComponent from '@/components/LoadingComponent';
import MatchItem from '@/components/MatchItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopBarNavigator from '@/components/TopBarNavigator';
import { useRouter } from 'expo-router';

const matchesOrganized = () => {

    const [ showNewMatchModal, setShowNewMatchModal ] = useState<boolean>(false);

    const { matchesOrganizedQuery } = useMatchesOrganized();
    const { bottom } = useSafeAreaInsets();

    const router = useRouter();

    if(matchesOrganizedQuery.isLoading) {
        return( 
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <LoadingComponent />
        </View>)
    };

    return (
        <>
            <View>
                {
                    matchesOrganizedQuery.isSuccess &&
                    <FlatList
                        data={matchesOrganizedQuery.data.matches}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={matchesOrganizedQuery.refetch}/>}
                        renderItem={({ item }) => <MatchItem match={item} /> }
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        style={{ paddingHorizontal: 10 }}
                    />
                }
                <DefaultView style={{position:'absolute', bottom: bottom + 10, left:'30%', right:'30%'}} >
                    {/* <Button style={{alignItems:'center', justifyContent:'space-between', flexDirection: 'row', height:40, borderRadius:40}} onPress={() => setShowNewMatchModal(true)} > */}
                    <Button style={{alignItems:'center', justifyContent:'space-between', flexDirection: 'row', height:40, borderRadius:40}} onPress={() => router.navigate({
                        pathname:'/(app)/(modals)/[matchModal]',
                        params: { matchModal: false }
                        })} >
                        <Text style={{ fontWeight:'600', textAlign:'center', flex:1, color:'white' }}>
                            New Match
                        </Text>
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
                        <TopBarNavigator goBackAction={() => console.log('epa')} icon='check' activeColor   />
                    </BottomModal>
                </>
            }
        </>
    );
};

export default matchesOrganized;