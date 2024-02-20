import { View, Text } from '@/components/Themed';
import { TouchableOpacity, StyleSheet } from 'react-native';
import ProfilePicture from './ProfilePicture';
import { useContext } from 'react';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useRouter } from 'expo-router'
import Icon from './Icon';

const TopBarProfile = () => {

    const { user } = useContext( AuthContext )

    const router = useRouter()

    return (
        <View style={[styles.topBar, styles.paddingHorizontal]}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical:10, borderRadius:16, backgroundColor:'transparent'}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => router.push({ pathname: '/(app)/profile/[id]', params: { id: '123' } })}>
                    <ProfilePicture  height={50} width={50} />
                </TouchableOpacity>
                <View style={{marginLeft:8, backgroundColor:'transparent'}}>
                    <Text style={{fontSize:14}}>Hey 👋 </Text>
                    <Text style={{fontSize:16, fontWeight:'600'}}>{user?.first_name} {user?.last_name} !</Text>
                </View>
            </View>
            <View style={{ justifyContent:'center', alignItems:'flex-end'}}>
                {/* <View style={{height:52, width:52, alignItems:'center', justifyContent:'center', backgroundColor:'transparent',  borderRadius:16}}>
                    <View style={{backgroundColor:'#131313', borderRadius:50, padding:10, alignContent:'center', justifyContent:'center'}}>
                        <Icon name='notifications-none' color={'white'} size={24} />
                    </View>
                </View> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height:'100%', 
        flex:1,
    },
    paddingHorizontal: {
        paddingHorizontal: 12,
    },
    topBar: {
        height: 65,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        textAlign: 'left',
        color: 'gray',
    },
    matchesList: {
        paddingHorizontal: 10,
        flex: 1,
    }
})

export default TopBarProfile;