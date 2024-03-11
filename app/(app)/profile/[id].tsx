import { useContext } from 'react';
import { StyleSheet, View, Text as DText } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Text, useThemeColor } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { AuthContext } from '@/context/authContext/AuthContext';
import ProfilePicture from '@/components/ProfilePicture';
import { usePlayerDetails } from '@/hooks/usePlayerDetails';
import MatchItem from '@/components/MatchItem';
import LoadingComponent from '@/components/LoadingComponent';

const profileDetail = () => {

    const router = useRouter()
    
    const { user } = useContext( AuthContext )
    const { id } = useLocalSearchParams() 

    const { playerDetailsQuery: { data, isLoading, isError }} = usePlayerDetails(id as string)

    //check if user is the same as the profile
    const isUser = user?.id === id

    const backgroundColor = useThemeColor({}, 'itemBackground')

    const navigateToSettings = () => {
        router.navigate({
            pathname:'/(app)/profile/settings',
        })
    }

    if(isLoading){
        return(
            <View style={[styles.container, {flex:1, justifyContent:'center', alignItems:'center'}]}>
                <LoadingComponent />
            </View>
        )
    }

    return (
        <>
            <TopBarNavigator icon={isUser ? 'settings': undefined} iconSize={20} action={navigateToSettings}/>
            <View style={[styles.container]}>
                <View style={[styles.imageContainer]}>
                    <View>
                        <ProfilePicture player={data?.user} uri={isUser ? user?.photo : data?.user.photo} height={100} width={100} allowFullScreen />
                    </View>
                </View>
                <View style={[styles.nameContainer]}>
                    <Text style={[styles.nameText]}> { isUser ? `${user?.first_name} ${user?.last_name}` : `${data?.user.first_name} ${data?.user.last_name}` } </Text>
                    <Text style={[styles.positionText]}> { isUser ? user.position : data?.user.position } </Text>
                </View>
                <View style={[styles.dataContainer]}>
                    <View style={[styles.dataBox, {backgroundColor}]}>
                        <Text style={[styles.dataTitle]}>Played</Text>
                        <View style={[styles.dataTextContainer]}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.dataText]}>{ data?.matchesPlayed.count.padStart(2, '0') }</Text>
                        </View>
                        <Text></Text>
                    </View>

                    <View style={[styles.dataBox, {backgroundColor}]}>
                        <Text style={[styles.dataTitle]} adjustsFontSizeToFit>Organized</Text>
                        <View style={[styles.dataTextContainer]}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.dataText]}>{ data?.matchesOrganized.count.padStart(2, '0') }</Text>
                        </View>
                        <Text></Text>
                    </View>

                    <View style={[styles.dataBox, {backgroundColor}]}>
                        <Text style={[styles.dataTitle]}>Rating</Text>
                        <View style={[styles.dataTextContainer]}>
                            <Text adjustsFontSizeToFit style={[styles.dataText]}>{data?.user.rating ?? '0.0'}</Text>
                        </View>
                        <Text></Text>
                    </View>
                </View>
                {
                    data?.lastMatchPlayed &&
                    <View style={[styles.dataContainer, {flexDirection:'column', alignItems:'flex-start'}]}>
                            <Text style={[styles.dataTitle, {marginBottom:6, marginLeft:8, textAlign:'left'}]}>Last match played</Text>
                            <MatchItem match={data?.lastMatchPlayed!} />
                    </View>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        width: '100%',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    nameContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    nameText: {
        fontSize: 26,
        fontWeight: '600',
        marginBottom: 2,
    },
    positionText: {
        fontSize: 20,
        fontWeight: '400',
    },
    dataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dataBox: {
        height: 120,
        width: '32%',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
    },
    dataTitle: {
        width:'100%',
        fontSize:14, 
        opacity:0.6,
        textAlign:'center',
        paddingTop:2
    },
    dataTextContainer: {
        width:'100%', 
        height:'55%', 
        alignItems:'center', 
        justifyContent:'center'
    },
    dataText: {
        fontSize:120, 
        textAlign:'center'
    },
});

export default profileDetail;