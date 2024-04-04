import { useContext, useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { isAxiosError } from 'axios';

import { TextInput, View as ViewThemed, Text, useThemeColor } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useForm } from '@/hooks/useForm';
import { useUpdateEmail } from '@/hooks/usePlayers';
import { sleep } from '@/utils/sleep';
import ModalLoadingInfo from '@/components/ModalLoadingInfo';

const editEmail = () => {
    const [ buttonDisabled, setButtonDisabled ] = useState(true);

    const [ error, setError ] = useState<string>('');
    const [ showLoading, setShowLoading ] = useState<boolean>(false);
    const [ mutationStatus, setMutationStatus ] = useState<'loading' | 'success' | 'error' >('loading');

    const { user, checkToken } = useContext( AuthContext )

    const { updateEmailQuery } = useUpdateEmail()

    const errorColor = useThemeColor({}, 'errorColor')
    const primaryColor = useThemeColor({}, 'primaryColor')

    const { email, onChange } = useForm<{email:string}>({
        email: user?.email!,
    })

    //Effect to enable the button when the user changes email
    useEffect(() => {
        if(
            (email !== user?.email ) &&
            (email.trim() !== '' )
        ){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }
    }, [email])

    const handleUpdateEmail = async () => {
        try{
            //Reset the error message and set the mutation status to loading
            setError('');
            setMutationStatus('loading');

            setShowLoading(true);
            Keyboard.dismiss();
            await updateEmailQuery.mutateAsync(email);
            setMutationStatus('success');
            checkToken();
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
                        <TopBarNavigator icon='check' activeColor disabled={buttonDisabled} action={handleUpdateEmail}/>
                    </View>
                    <View style={{flex: 1, width:'100%', paddingHorizontal:16, marginTop:0}}>
                        <TextInput
                            placeholder='Email'
                            containerStyle={{marginTop: 8}}
                            autoFocus
                            enablesReturnKeyAutomatically={false}
                            value={email}
                            inputMode='email'
                            onChangeText={value => onChange(value, 'email')}
                            onSubmitEditing={handleUpdateEmail}
                        />
                        {/* <Text style={{opacity:0.5, paddingLeft:4, marginTop:8}}>
                                You will need to verify your new email
                        </Text> */}
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
                                    { updateEmailQuery.data.data }
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

export default editEmail;