import { View, Text } from '@/components/Themed';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useForm } from '@/hooks/useForm';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Keyboard, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';

const login = () => {

    const router = useRouter();

    const { login, error, status } = useContext( AuthContext )
    const [ inputErrors, setInputErrors ] = useState(false);

    useEffect(() => {
        if(error){
            setInputErrors(true);
        }
    }, [error])

    const { email, password, onChange } = useForm({
        email: '',
        password: '' 
    });

    const handleLogin = () => {
        Keyboard.dismiss();
        login({ username: email, password })
    }

    useEffect(() => {
        if(status === 'authenticated'){
            router.navigate('/(app)/');
        }
    }, [status])

    return (
        <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1, width:'100%', justifyContent: 'center', paddingHorizontal: 20}}
        >
            {/* Title o lo que sea */}
            <View>
                <Text>Login</Text>
            </View>
            {/* Form */}
            <View style={{ alignContent:'center', justifyContent:'center'}}>
                <TextInput 
                placeholder="Email or username" 
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={ (value) => onChange(value, 'email') }
                value={ email }
                autoCorrect={false}
                onFocus={
                    () => setInputErrors(false)
                }
                style={{ marginBottom: 15, borderWidth: 1,
                borderRadius: 5, height: 45, paddingHorizontal: 10, borderColor: inputErrors ? 'red': 'black'}}
                />
                <TextInput
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={ (value) => onChange(value, 'password') }
                value={ password }
                autoCorrect={false}
                onFocus={
                    () => setInputErrors(false)
                }
                style={{ marginBottom: 15, borderWidth: 1, 
                borderRadius: 5, height: 45, paddingHorizontal: 10, borderColor: inputErrors ? 'red': 'black'}}
                />
                <View>
                <TouchableOpacity
                    activeOpacity={ 0.8 }
                    style={{ backgroundColor: 'teal', padding: 10, borderRadius: 5, alignItems: 'center'}}
                    onPress={ handleLogin }
                >
                    <Text>Login</Text>
                </TouchableOpacity>
                </View>
            </View>
            {/* Buttons */}
            <View style={{ alignContent:'center', justifyContent:'center'}}>
                <Button title="Register" onPress={ () => router.navigate('register') } />
            </View>
        </KeyboardAvoidingView>
    );
};

export default login;