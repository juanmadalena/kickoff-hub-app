import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, useThemeColor } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Icon from './Icon';

const TopBarNavigator = () => {

    const router = useRouter()
    const backgroundColor = useThemeColor({}, 'itemBackground');

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.backContainer, {backgroundColor}]} onPress={() => router.back()}>
                <Icon name='arrow-back' size={24} />
            </TouchableOpacity>
            <View></View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { 
        paddingHorizontal: 12,
        // borderWidth:1,
        // borderColor: 'yellow',
        width: '100%',
        justifyContent: 'space-between', 
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:8        
    },
    backContainer: {
        height: 50,
        width: 50,
        borderRadius: 120,
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default TopBarNavigator;