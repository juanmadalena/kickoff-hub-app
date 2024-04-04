import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, View as ViewThemed, Text } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useForm } from '@/hooks/useForm';

const editEmail = () => {
    const [ buttonDisabled, setButtonDisabled ] = useState(true);

    const { user } = useContext( AuthContext )

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

    const handleUpdateEmail = () => {
        throw new Error('Function not implemented.');
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
                        <Text style={{opacity:0.5, paddingLeft:4, marginTop:8}}>
                                You will need to verify your new email
                        </Text>
                    </View>
                </ViewThemed>
            </KeyboardAvoidingView>
        </>
    );
};

export default editEmail;