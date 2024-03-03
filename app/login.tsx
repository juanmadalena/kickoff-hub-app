import { useContext, useEffect, useState } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';

import LogoImage from '@/components/LogoImage';
import { View, Text, Button, TextInput } from '@/components/Themed';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useFade } from '@/hooks/useFade';
import { useForm } from '@/hooks/useForm';
import { commonStyles } from '@/styles/authStyle'
import useKeyboardActive from '@/hooks/useKeyboardActive';

interface loginForm {
    email: string;
    password: string;       
}

const login = () => {

    const router = useRouter();
    const [ loading, setLoading ] = useState(false);

    const { login, error, status, removeError } = useContext( AuthContext )
    const { fadeIn, fadeOut, opacity } = useFade();
    const { keyboardActive } = useKeyboardActive();

    //Form state
    const { email, password, onChange } = useForm<loginForm>({
        email: 'juanmadalena06@gmail.com',
        password: '12345678' 
        // email: '',
        // password: '' 
    });

    //Effect to fade in the form
    useEffect(() => {
        removeError();
        fadeIn(300);
    }, [])

    //If the status changes to authenticated, navigate to the app
    useEffect(() => {
        if(status === 'authenticated'){
            fadeOut(100, () => router.navigate('/(app)/') )
        }
    }, [status])

    //If there is an error, stop the loading
    useEffect(() => {
        if(error !== null){
            setLoading(false);
        }
    }, [error])

    const navigateToRegister = () => {
        fadeOut(100, () => router.replace('/register'))
    }

    const handleLogin = async () => {
        setLoading(true);
        Keyboard.dismiss();
        login({ email: email, password })
    }

    return(
        <>
        <LogoImage />
        <KeyboardAvoidingView style={commonStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={150}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <Animated.View style={{...commonStyles.innerContainer, opacity}}>
                     
                     {/* Title */}   
                    <View style={commonStyles.titleContainer}>
                        <Text style={commonStyles.title}>Welcome Back!</Text>
                        <Text style={commonStyles.subtitle}>Please fill the form to create an account</Text>
                    </View>
                        {/* Form */}
                        <View style={[commonStyles.formContainer, {height:'72%'}]}>

                            <TextInput
                                placeholder="Email"
                                error={error !== null}
                                value={email}
                                onChangeText={value => onChange(value, 'email')}
                                keyboardType="email-address"
                                autoCorrect={ false }
                                autoComplete='email'
                            />

                            <TextInput
                                placeholder="Password"
                                error={error !== null}
                                value={password}
                                autoCorrect={ false }
                                onChangeText={value => onChange(value, 'password')}
                                secureTextEntry
                                autoComplete='password'
                            />


                            {/* Button to submit */}
                            <Button style={{marginTop:18}} disabled={loading} loading={loading} onPress={handleLogin}>
                                <Text style={commonStyles.buttonText}>Login</Text>
                            </Button>
                            
                            {/* Error message */}
                            <Text style={{color:'red', textAlign:'center', marginTop:20}}>{error?.message ?? ' '}</Text>

                        </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* Link to login */}
        {
            // Hide link when keyboard is active
            !keyboardActive && (
                <Animated.View style={{opacity}}>
                    <Text style={{textAlign:'center', color: '#005B41', fontWeight: '600'}} onPress={navigateToRegister}>Create an account</Text>
                </Animated.View>
            )
        }
        </>
    )
};


export default login;