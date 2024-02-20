import { StyleSheet, View, useColorScheme } from 'react-native';
import { Text } from './Themed';
import Icon from './Icon';
import Colors from '@/constants/Colors';

interface Props {
    text: string;
    IconName?: React.ComponentProps<typeof Icon>['name'];
}

const MatchDetailChip = ({ text, IconName }: Props) => {

    const colorScheme = useColorScheme()

    return (
        <View style={{...styles.container, backgroundColor: Colors[colorScheme ?? 'light'].selectionBackground }}>
            {
                IconName && <Icon name={IconName} size={14} style={{marginRight: 4}}/>
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
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginRight: 10,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    }
})

export default MatchDetailChip;