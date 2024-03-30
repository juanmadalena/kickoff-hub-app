import { StyleSheet, View as DefaultView, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';
import Icon from './Icon';
import MatchDetailChip from './MatchDetailChip';
import { Match, MatchesPlayedData } from '@/interfaces';
import { checkIfMatchIsAvailable } from '@/utils/checkIfMatchIsAvailable';
import { useFade } from '@/hooks/useFade';
import { useEffect } from 'react';
import { formatDateToString } from '@/utils/formatDateToString';

interface Props {
    match: Match,
    height?: number,
    index?: number,
    checkMatches?: boolean
}

const MatchItem = ({ match, index = 0, height = 135, checkMatches = true }: Props) => {

    const primaryColor = useThemeColor({}, 'primaryColor');
    // const isActive = checkIfMatchIsAvailable(match) == 'join'  ? true : false;
    const isActive = checkIfMatchIsAvailable(match) == 'join'  ? true : false;
    // console.log('isActive', isActive)
    // const isActive = true;
    const { opacity, fadeIn } = useFade();

    // fade in animation
    useEffect(() => {
        fadeIn(300);
    }, [])

    return (
        <Animated.View style={{...styles.container, backgroundColor: isActive ? primaryColor : `${primaryColor}AC`, height, opacity}}>
            <DefaultView style={{height: '100%', width:'80%', justifyContent:'space-between', opacity: isActive ? 1 : 0.5}}>
                <DefaultView style={{justifyContent: 'center'}}>
                    <Text style={{fontSize:14, fontWeight:'400', opacity:0.8, color:'white'}}>{match.address}</Text>
                </DefaultView>
                <DefaultView style={{justifyContent: 'center', width:'100%', height:'45%', paddingBottom:4}}>
                    <Text style={{fontSize:120, width:'80%', fontWeight:'500', color:'white'}} numberOfLines={1} adjustsFontSizeToFit>{match.location}</Text>
                </DefaultView>
                <DefaultView style={{flexDirection:'row', width:'100%', alignItems: 'center'}}>
                    <MatchDetailChip text={match.time.slice(0,-3)} />
                    <MatchDetailChip text={match.num_players +' / ' + match.max_players} />
                    {/* <MatchDetailChip text={match.price + ' €'} /> */}
                </DefaultView>
            </DefaultView>
            <DefaultView style={{width:'20%',alignItems:'flex-end', flex:1, justifyContent:'flex-end', padding:4}}>
                {
                    isActive &&
                        <TouchableOpacity 
                            style={{backgroundColor:'transparent', alignItems: 'center', justifyContent: 'center'}}
                            activeOpacity={0.8}
                            onPress={() => router.navigate({
                                pathname: '/(app)/match/[id]',
                                params: { id: match.id },
                            })}
                        >
                            <Icon name='arrow-outward' size={25} color='white'/>
                        </TouchableOpacity>
                }
            </DefaultView>
        </Animated.View>
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