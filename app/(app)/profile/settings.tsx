import { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MediaTypeOptions, launchImageLibraryAsync, useMediaLibraryPermissions } from 'expo-image-picker';

import { Text, useThemeColor } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { AuthContext } from '@/context/authContext/AuthContext';
import Icon from '@/components/Icon';
import ProfilePicture from '@/components/ProfilePicture';
import { createProfilePhotoFormData } from '@/utils/createProfilePhotoFormData';
import { useUploadProfilePhoto } from '@/hooks/usePlayers';
import ModalLoadingInfo from '@/components/ModalLoadingInfo';
import { sleep } from '@/utils/sleep';

const settings = () => {

    const router = useRouter()

    const [ modalLoading, setModalLoading ] = useState(false)
    const [ statusModal, setStatusModal ] = useState<"loading" | "success" | "error">("loading")

    const { user, logout, checkToken } = useContext( AuthContext )

    const backgroundColor = useThemeColor({}, 'itemBackground')
    const itemBackground = useThemeColor({}, 'selectionBackground')

    const [ status, requestPermission ] = useMediaLibraryPermissions()

    const { uploadProfilePhotoQuery } = useUploadProfilePhoto()

    const handleModalLoadingClose = async () => {
        await sleep(2500)
        setModalLoading(false)
        setStatusModal('loading')
    }

    const handleImagePicker = () => {
        requestPermission()
        launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        }).then( async ({assets, canceled}) => {
            if(assets?.length === 0 && assets || canceled) return

            setModalLoading(true)

            const formData = createProfilePhotoFormData(assets?.at(0)?.uri!, user?.id!)
            
            const statusResponse = await uploadProfilePhotoQuery.mutateAsync(formData)

            if(statusResponse === 200){
                setStatusModal("success")
                handleModalLoadingClose()
                checkToken()
            }else{
                setStatusModal("error")
                handleModalLoadingClose()
            }

        }).catch( (error) => {
            console.log(error)
        })
    }
    
    return (
        <>
            <TopBarNavigator />
            {
               modalLoading && <ModalLoadingInfo status={statusModal} />
            }
            <View style={[styles.container]}>
                <View style={[styles.imageContainer]}>
                    <View>
                        <ProfilePicture uri={user?.photo} height={100} width={100} allowFullScreen />
                        <TouchableOpacity 
                            onPress={() =>handleImagePicker()}
                            style={{height:30, width:30, alignItems:'center', justifyContent:'center', position:'absolute', bottom:0, right:0, paddingLeft:1, backgroundColor:itemBackground, borderRadius:50}}
                        >
                            <Icon name='camera-alt' size={16} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.nameContainer]}>
                    <Text style={[styles.nameText]}> { user?.first_name } { user?.last_name } </Text>
                </View>
                <TouchableOpacity 
                    activeOpacity={0.6} 
                    style={{marginBottom:10, height:85, paddingHorizontal:12, width:'100%', backgroundColor, borderRadius:18, flexDirection:'row', alignItems:'center'}}
                    onPress={() => router.navigate('/(app)/profile/(modals)/editBasicInfo')}
                >
                    <View style={{marginLeft:4}}>
                        <Text style={{fontSize:18, fontWeight:'500'}}> User Information </Text>
                        <Text style={{fontSize:14, opacity:0.6}}> First name, Last name, Position </Text>
                    </View>
                    <View style={{ flex:1 ,alignItems:'flex-end' }}>
                        <View style={{height:40, width:40, borderRadius:100, backgroundColor: itemBackground, alignItems:'center', justifyContent:'center'}}>
                            <Icon name='person' size={20} />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity 
                    activeOpacity={0.6} 
                    style={{marginBottom:10, height:85, paddingHorizontal:12, width:'100%', backgroundColor, borderRadius:18, flexDirection:'row', alignItems:'center'}}
                    onPress={() => router.navigate('/(app)/profile/editBasicInfo')}
                >
                    <View style={{marginLeft:4}}>
                        <Text style={{fontSize:18, fontWeight:'500'}}> Position </Text>
                        <Text style={{fontSize:14, opacity:0.6}}> Change player position </Text>
                    </View>
                    <View style={{ flex:1 ,alignItems:'flex-end' }}>
                        <View style={{height:40, width:40, borderRadius:100, backgroundColor: itemBackground, alignItems:'center', justifyContent:'center'}}>
                            <Icon name='sports-soccer' size={20} />
                        </View>
                    </View>
                </TouchableOpacity> */}

                <TouchableOpacity 
                    activeOpacity={0.6} 
                    style={{marginBottom:10, height:85, paddingHorizontal:12, width:'100%', backgroundColor, borderRadius:18, flexDirection:'row', alignItems:'center'}}
                    onPress={() => router.navigate('/(app)/profile/(modals)/editEmail')}
                >
                    <View style={{marginLeft:4}}>
                        <Text style={{fontSize:18, fontWeight:'500'}}> Email </Text>
                        <Text style={{fontSize:14, opacity:0.6}}> Change your email account  </Text>
                    </View>
                    <View style={{ flex:1 ,alignItems:'flex-end' }}>
                        <View style={{height:40, width:40, borderRadius:100, backgroundColor: itemBackground, alignItems:'center', justifyContent:'center'}}>
                            <Icon name='mail' size={20} />
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity={0.6} 
                    style={{marginBottom:10, height:85, paddingHorizontal:12, width:'100%', backgroundColor, borderRadius:18, flexDirection:'row', alignItems:'center'}}
                    onPress={() => router.navigate('/(app)/profile/editPassword')}
                >
                    <View style={{marginLeft:4}}>
                        <Text style={{fontSize:18, fontWeight:'500'}}> Password </Text>
                        <Text style={{fontSize:14, opacity:0.6}}> Change your password </Text>
                    </View>
                    <View style={{ flex:1 ,alignItems:'flex-end' }}>
                        <View style={{height:40, width:40, borderRadius:100, backgroundColor: itemBackground, alignItems:'center', justifyContent:'center'}}>
                            <Icon name='security' size={20} />
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity={0.6} 
                    style={{marginBottom:10, height:85, paddingHorizontal:12, width:'100%', backgroundColor, borderRadius:18, flexDirection:'row', alignItems:'center'}}
                    onPress={() => logout()}
                >
                    <View style={{marginLeft:4}}>
                        <Text style={{fontSize:18, fontWeight:'500'}}> Logout </Text>
                    </View>
                    <View style={{ flex:1 ,alignItems:'flex-end' }}>
                        <View style={{height:40, width:40, borderRadius:100, backgroundColor: itemBackground, alignItems:'center', justifyContent:'center'}}>
                            <Icon name='logout' size={20} />
                        </View>
                    </View>
                </TouchableOpacity>
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
        marginBottom: 24,
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
});

export default settings;