import { View, KeyboardAvoidingView, Platform, TextInput as DefaultTextInput } from 'react-native';
import { TextInput, View as ViewThemed, Text } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useForm } from '@/hooks/useForm';

const editPassword = () => {
    const [ buttonDisabled, setButtonDisabled ] = useState(true);

    const { user } = useContext( AuthContext )

    const newPasswordRef = useRef<DefaultTextInput | null>(null)

    const { oldPassword, newPassword, onChange } = useForm<{oldPassword:string, newPassword:string}>({
        oldPassword: '',
        newPassword: '',
    })

    //Effect to enable the button when the user changes the password
    useEffect(() => {
        if(oldPassword.trim() !== '' && newPassword.trim() !== ''){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }
    }, [oldPassword, newPassword])

    const handleUpdateEmail = () => {
        console.log('update email');
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
                            placeholder='Password'
                            containerStyle={{marginTop: 8}}
                            autoFocus
                            enablesReturnKeyAutomatically={false}
                            value={oldPassword}
                            secureTextEntry
                            onChangeText={value => onChange(value, 'oldPassword')}
                            onSubmitEditing={handleUpdateEmail}
                        />
                        <TextInput
                            innerRef={newPasswordRef}
                            placeholder='New Password'
                            containerStyle={{marginTop: 8}}
                            enablesReturnKeyAutomatically={false}
                            value={newPassword}
                            secureTextEntry
                            onChangeText={value => onChange(value, 'newPassword')}
                            onSubmitEditing={handleUpdateEmail}
                        />
                        <Text style={{opacity:0.5, paddingLeft:4, marginTop:8}}>
                                Your password must be at least 8 characters long
                        </Text>
                    </View>
                </ViewThemed>
            </KeyboardAvoidingView>
        </>
    );
};

export default editPassword;