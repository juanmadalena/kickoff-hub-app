import { StyleSheet, View } from 'react-native';

import Icon from './Icon';
import { Text } from '@/components/Themed';

interface Props {
    text: string
    IconName?: React.ComponentProps<typeof Icon>['name'],
    style?: View['props']['style']
}

const MatchDetailChip = ({ text, IconName, style }: Props) => {


    return (
        <View style={[styles.container, style, { backgroundColor:'#FFFFFF22' }]} >
            {
                IconName && <Icon name={IconName} size={14} style={{marginRight: 4, color:'white'}}/>
            }
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        opacity: 0.8,
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 10,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        color:'white'
    }
})

export default MatchDetailChip;