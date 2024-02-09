import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from './Icon';

const TopBarNavigator = () => {

    const router = useRouter()
    const { height } = useSafeAreaFrame()
    const {  } = useSafeAreaInsets()

    return (
        <View style={{...styles.container}}>
            <TouchableOpacity style={styles.backContainer} onPress={() => router.back()}>
                <Icon name='arrow-back' size={24} color='black' />
            </TouchableOpacity>
            <View></View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { 
        backgroundColor: 'transparent',
        position: 'absolute',
        paddingHorizontal: 20,
        height: 80,
        width: '100%',
        justifyContent: 'space-between', 
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100,
    },
    backContainer: {
        backgroundColor: '#D9D9D9',
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default TopBarNavigator;