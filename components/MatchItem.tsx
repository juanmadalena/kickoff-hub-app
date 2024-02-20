import { StyleSheet, View as DefaultView, TouchableHighlight, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';
import Icon from './Icon';
import MatchDetailChip from './MatchDetailChip';
import { Match } from '@/interfaces';

interface Props {
    match: Match,
}

const MatchItem = ({ match }: Props) => {

    const backgroundColor = useThemeColor({}, 'itemBackground');
    const buttonColor = useThemeColor({}, 'primaryColor');

    return (
        <View style={{...styles.container, backgroundColor}}>
            <DefaultView style={{height: '100%', justifyContent:'space-between'}}>
                <DefaultView style={{justifyContent: 'center'}}>
                    <Text style={{fontSize:14, fontWeight:'400'}}>Lansdowne Rd, Dublin 4</Text>
                    <Text style={{fontSize:30, fontWeight:'500'}}>{match.location}</Text>
                </DefaultView>
                <DefaultView style={{flexDirection:'row', width:'100%', alignItems: 'center'}}>
                    <MatchDetailChip text={match.time.slice(0,-3)} />
                    <MatchDetailChip text={match.num_players +' / ' + match.max_players} />
                    <MatchDetailChip text={match.price + ' €'} />
                </DefaultView>
            </DefaultView>
            <DefaultView style={{alignItems:'flex-end', flex:1, justifyContent:'flex-end', padding:4}}>
                <TouchableOpacity 
                    style={{backgroundColor:buttonColor, padding:10, borderRadius:30, alignItems: 'center', justifyContent: 'center'}}
                    activeOpacity={0.8}
                    onPress={() => router.navigate({
                        pathname: '/(app)/match/[id]',
                        params: { id: match.id },
                    })}
                >
                    <Icon name='arrow-outward' size={35} color='white'/>
                </TouchableOpacity>
            </DefaultView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 135,
        width: '100%',
        marginBottom: 12,
        borderRadius: 16,
        flexDirection: 'row',
        paddingVertical: 14,
        paddingLeft: 16,
        paddingRight: 12,
    }
})

export default MatchItem;