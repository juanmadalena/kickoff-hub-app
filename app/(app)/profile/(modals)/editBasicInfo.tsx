import { Alert, View, TextInput as DefaultTexInput, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { TextInput, Text, View as ViewThemed } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { useForm } from '@/hooks/useForm';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useContext, useEffect, useRef, useState } from 'react';
import ModalLoadingInfo from '@/components/ModalLoadingInfo';
import { sleep } from '@/utils/sleep';
import { useRouter } from 'expo-router';
import { useUpdateUserBasicInfo } from '@/hooks/usePlayers';
import { useNavigation } from '@react-navigation/native';
import BottomModal from '@/components/BottomModal';
import PositionPicker from '@/components/PositionPicker';
import { Position } from '@/interfaces';

const editBasicInfo = () => {
    //router
    const router = useRouter();
    const navigation = useNavigation();

    const { updateUserBasicInfoQuery } = useUpdateUserBasicInfo();

    //State
    const [ status, setStatus ] = useState<"loading" | "success" | "error">("loading");
    const [ loading, setLoading ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(true);
    const [ showPositionModal, setShowPositionModal ] = useState(false);

    //Refs
    const lastNameRef = useRef<DefaultTexInput>()

    //Get the user from the context
    const { user, checkToken } = useContext( AuthContext )

    //Form state
    const { firstName, lastName, position, onChange } = useForm<{firstName:string, lastName:string, position:Position}>({
        firstName: user?.first_name!,
        lastName: user?.last_name!,
        position: user?.position!,
    })

    //Effect to enable the button when the user changes the first or last name
    useEffect(() => {
        if(
            (firstName !== user?.first_name || lastName !== user?.last_name || position != user?.position) &&
            (firstName.trim() !== '' && lastName.trim() !== '' && position.trim() !== '')
        ){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }
    }, [firstName, lastName, position])

    const handleUpdateInfo = async () => {
        Keyboard.dismiss();
        navigation.setOptions({ swipeEnabled: false, gestureEnabled: false });
        setLoading(true);
        try{
            await updateUserBasicInfoQuery.mutateAsync( {firstName, lastName, position});
            setStatus("success");
        }
        catch(e){
            setStatus("error");
        }
        finally{
            await sleep(1000);
            setLoading(false);
            checkToken();
            navigation.setOptions({ swipeEnabled: true, gestureEnabled: true });
            router.back();
        }
    }

    return (
        <>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
                <ViewThemed style={{ flex:1, paddingTop:4 }}>
                    <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', paddingTop:4}}>
                        <View style={{backgroundColor:'grey', opacity:0.4, borderRadius:18, width:100, height:5, marginBottom:8}}>
                        </View>
                        <TopBarNavigator icon='check' activeColor disabled={buttonDisabled} action={handleUpdateInfo}/>
                    </View>
                    <View style={{flex: 1, width:'100%', paddingHorizontal:16, marginTop:0}}>
                        <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
                            <TextInput
                                placeholder='First Name'
                                containerStyle={{marginTop: 8, width:'49%'}}
                                value={firstName}
                                onChangeText={value => onChange(value, 'firstName')}
                                autoFocus
                                onSubmitEditing={() => lastNameRef.current && lastNameRef.current.focus()}
                                enablesReturnKeyAutomatically={false}
                            />
                            <TextInput
                                innerRef={lastNameRef}
                                placeholder='Last Name'
                                containerStyle={{marginTop: 8, width:'49%'}}
                                value={lastName}
                                onChangeText={value => onChange(value, 'lastName')}
                                enablesReturnKeyAutomatically={false}
                            />
                        </View>
                        <View>
                            <TouchableOpacity activeOpacity={1} onPressIn={() => Keyboard.dismiss()} onPressOut={() => setShowPositionModal(true)}>
                                <TextInput
                                    placeholder='Position'
                                    containerStyle={{marginTop: 8}}
                                    value={position}
                                    enablesReturnKeyAutomatically={false}
                                    onTouchStart={() => Keyboard.dismiss()}
                                    onTouchEnd={() => setShowPositionModal(true)}
                                    editable={false}
                                    inputMode='none'                                  
                                    />
                            </TouchableOpacity>
                        </View>
                        <Text style={{opacity:0.5, paddingLeft:4, marginTop:8}}>
                            Change your basic information
                        </Text>
                    </View>
                </ViewThemed>
            </KeyboardAvoidingView>
            {
                showPositionModal && 
                (
                    <>
                        <BottomModal
                            duration={300}
                            modalHeight={450}
                            transparent
                        >
                            <PositionPicker
                                position={position}
                                onSelectPosition={ (position) => {
                                    onChange(position, 'position');
                                    setShowPositionModal(false);
                                }}
                            />
                        </BottomModal>

                    </>
                )
            }
            {
                loading && <ModalLoadingInfo status={status} />
            }
        </>
    );
};

export default editBasicInfo;