import { useEffect, useRef, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, TextInput as DefaultTextInput, Keyboard } from 'react-native';
import { isAxiosError } from 'axios';

import { TextInput, View as ViewThemed, Text, useThemeColor } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { useForm } from '@/hooks/useForm';
import { useUpdatePassword } from '@/hooks/usePlayers';
import ModalLoadingInfo from '@/components/ModalLoadingInfo';
import { sleep } from '@/utils/sleep';

const editPassword = () => {
    const [ buttonDisabled, setButtonDisabled ] = useState<boolean>(true);

    const [ showLoading, setShowLoading ] = useState<boolean>(false);
    const [ mutationStatus, setMutationStatus ] = useState<'loading' | 'success' | 'error' >('loading');

    const [ error, setError ] = useState<string>('');

    const { updatePasswordQuery } = useUpdatePassword()

    const newPasswordRef = useRef<DefaultTextInput | null>(null)

    const errorColor = useThemeColor({}, 'errorColor')
    const primaryColor = useThemeColor({}, 'primaryColor')

    const { oldPassword, newPassword, onChange } = useForm<{oldPassword:string, newPassword:string}>({
        oldPassword: '',
        newPassword: '',
    })

    //Effect to enable the button when the user changes the password
    useEffect(() => {
        if(oldPassword.trim() !== '' && newPassword.trim() !== '' && newPassword.length >= 8 ){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }
    }, [oldPassword, newPassword])

    const handleUpdatePassword = async () => {
        try{
            //Reset the error message and set the mutation status to loading
            setError('');
            setMutationStatus('loading');

            setShowLoading(true);
            Keyboard.dismiss();
            await updatePasswordQuery.mutateAsync({oldPassword, newPassword});
            setMutationStatus('success');
        }
        catch(err: any){
            setMutationStatus('error');

            if(isAxiosError(err)){
                setError(err.response?.data?.message || 'An error occurred, please try again later');
            }else{
                setError('An error occurred, please try again later');
            }
        }
        finally{
            await sleep(2000);
            setShowLoading(false);
        }
    }

    return (
        <>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
                <ViewThemed style={{ flex:1, paddingTop:4 }}>
                    <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', paddingTop:4}}>
                        <View style={{backgroundColor:'grey', opacity:0.4, borderRadius:18, width:100, height:5, marginBottom:8}}>
                        </View>
                        <TopBarNavigator icon='check' activeColor disabled={buttonDisabled} action={handleUpdatePassword}/>
                    </View>
                    <View style={{flex: 1, width:'100%', paddingHorizontal:16, marginTop:0}}>
                        <TextInput
                            placeholder='Password'
                            containerStyle={{marginTop: 8}}
                            autoFocus
                            enablesReturnKeyAutomatically={false}
                            value={oldPassword}
                            secureTextEntry
                            onChangeText={value => onChange(value, 'oldPassword')}
                            onSubmitEditing={() => newPasswordRef.current?.focus()}
                            error={error !== ''}
                        />
                        <TextInput
                            innerRef={newPasswordRef}
                            placeholder='New Password'
                            containerStyle={{marginTop: 8}}
                            enablesReturnKeyAutomatically={false}
                            value={newPassword}
                            secureTextEntry
                            onChangeText={value => onChange(value, 'newPassword')}
                            onSubmitEditing={handleUpdatePassword}
                            error={error !== ''}
                        />
                        <Text style={{opacity:0.5, paddingLeft:4, marginTop:8}}>
                                Your password must be at least 8 characters long
                        </Text>
                        {
                            error !== '' &&
                            <View style={{width:'100%', backgroundColor:`${errorColor}66`, alignItems:'center', justifyContent:'center', borderRadius:10, marginTop:8}}>
                                <Text style={{fontSize:14, fontWeight:'600', padding:10}}>
                                    {error}
                                </Text>
                            </View>
                        }
                        {
                            mutationStatus === 'success' &&
                            <View style={{width:'100%', backgroundColor:`${primaryColor}66`, alignItems:'center', justifyContent:'center', borderRadius:10, marginTop:8}}>
                                <Text style={{fontSize:14, fontWeight:'600', padding:10}}>
                                    Password updated successfully
                                </Text>
                            </View>
                        
                        }
                    </View>
                </ViewThemed>
            </KeyboardAvoidingView>
            { showLoading && <ModalLoadingInfo status={mutationStatus} /> }
        </>
    );
};

export default editPassword;