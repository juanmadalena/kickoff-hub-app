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
        flexDirection: 'row',
        padding: 5,
        paddingHorizontal: 8,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        marginRight: 10,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    }
})

export default MatchDetailChip;