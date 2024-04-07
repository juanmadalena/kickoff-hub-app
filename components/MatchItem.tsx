import { StyleSheet, View as DefaultView, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Text, useThemeColor } from '@/components/Themed';
import Icon from './Icon';
import MatchDetailChip from './MatchDetailChip';
import { Match } from '@/interfaces';
import { checkIfMatchIsAvailable } from '@/utils/checkIfMatchIsAvailable';
import { useFade } from '@/hooks/useFade';
import { useEffect } from 'react';

interface Props {
    match: Match,
    height?: number,
    index?: number,
    checkMatches?: boolean
    cardColor?: string
}

const MatchItem = ({ match, index = 0, height = 135, checkMatches = true, ...props}: Props) => {

    const isActive = checkMatches ? checkIfMatchIsAvailable(match) == 'join'  ? true : false : true;
    const { opacity, fadeIn } = useFade();

    const primaryColor = useThemeColor({}, 'primaryColor');
    const { cardColor = primaryColor } = props;

    // fade in animation
    useEffect(() => {
        fadeIn(300);
    }, [])

    return (
        <TouchableOpacity 
            style={{backgroundColor:'transparent', alignItems: 'center', justifyContent: 'center'}}
            activeOpacity={0.8}
            onPress={() => router.navigate({
                pathname: '/(app)/match/[id]',
                params: { id: match.id },
            })}
        >
            <Animated.View style={{...styles.container, backgroundColor: isActive ? cardColor : `${cardColor}AC`, height, opacity}}>
                <DefaultView style={{height: '100%', width:'80%', justifyContent:'space-between', opacity: isActive ? 1 : 0.8}}>
                    <DefaultView style={{justifyContent: 'center', width:'100%'}}>
                        <Text numberOfLines={1} style={{fontSize:14, fontWeight:'400', opacity:0.8, color:'white', width:'100%'}}>{match.address}</Text>
                    </DefaultView>
                    <DefaultView style={{justifyContent: 'center', width:'100%', height:'45%', paddingBottom:4}}>
                        <Text style={{ textDecorationLine: match?.is_canceled ? 'line-through' : 'none' , fontSize:120, width:'95%', fontWeight:'500', color:'white'}} numberOfLines={1} adjustsFontSizeToFit>{match.location}</Text>
                    </DefaultView>
                    <DefaultView style={{flexDirection:'row', width:'100%', alignItems: 'center'}}>
                        <MatchDetailChip text={match.time?.slice(0,-3)} style={{ opacity: isActive ? 1 : 0.3 }} />
                        <MatchDetailChip text={match.num_players +' / ' + match.max_players} style={{ opacity: isActive ? 1 : 0.3 }} />
                    </DefaultView>
                </DefaultView>
                <DefaultView style={{width:'20%',alignItems:'flex-end', flex:1, justifyContent:'flex-end', padding:4}}>
                    <Icon name='arrow-outward' size={25} color='white'/>
                </DefaultView>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 8,
        borderRadius: 16,
        flexDirection: 'row',
        paddingVertical: 14,
        paddingLeft: 16,
        paddingRight: 16,
    }
})

export default MatchItem;