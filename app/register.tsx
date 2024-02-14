import { useContext, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Animated, TextInput as DefaultTexInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';

import BottomModal from '@/components/BottomModal';
import LogoImage from '@/components/LogoImage';
import PositionPicker from '@/components/PositionPicker';
import { View, Text, TextInput, Button } from '@/components/Themed';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useFade } from '@/hooks/useFade';
import { useForm } from '@/hooks/useForm';
import useKeyboardActive from '@/hooks/useKeyboardActive';
import { commonStyles } from '@/styles/authStyle'

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    position: string;
}

const register = () => {

    // Refs
    const lastNameRef = useRef<DefaultTexInput | null>(null)
    const emailRef = useRef<DefaultTexInput | null>(null)
    const passwordRef = useRef<DefaultTexInput | null>(null)
    const positionRef = useRef<DefaultTexInput | null>(null)

    const { register, status, error, removeError } = useContext(AuthContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const { fadeIn, fadeOut, opacity } = useFade();

    const { firstName, lastName, position, email, password, onChange } = useForm<RegisterForm>({
        firstName: 'juan',
        lastName: 'madalena',
        email: 'juanmadalena',
        password: '1234',
        position: 'GK',
    });


    const router = useRouter();

    const { keyboardActive } = useKeyboardActive();

    const handleRegister = async () => { 
        Keyboard.dismiss();
        register({ firstName, lastName, email, password, position });
    }

    useEffect(() => {
        removeError();
        fadeIn(300);
    }, [])

    useEffect(() => {
        if(status === 'authenticated'){
            fadeOut(300, () => router.replace('/(app)/'))
        }
    }, [status])

    const modalHandler = () => {
        Keyboard.dismiss();
        setShowModal(!showModal);
    }

    const handleSelection = ( value: string ) => {
        onChange(value, 'position');
        setShowModal(false);
    }

    const navigateToLogin = () => { 
        fadeOut(100, () => router.replace('/login'))
    }

    return (
        <>
        {/* Logo */}
        <LogoImage />
        <KeyboardAvoidingView style={{flex: 1, paddingHorizontal:20}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={180}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <Animated.View style={{ ...commonStyles.innerContainer ,opacity }}>
                        {/* Title */}   
                        <View style={commonStyles.titleContainer}>
                            <Text style={commonStyles.title}>Create an account</Text>
                            {
                                !keyboardActive && <Text style={commonStyles.subtitle}>Please fill the form to create an account</Text>
                            }
                        </View>

                        {/* Form */}
                        <View style={commonStyles.formContainer}>

                            <View style={styles.nameContainer}>
                                <TextInput
                                    placeholder="First Name"
                                    autoCapitalize="words"
                                    style={[styles.nameField]}
                                    value={firstName}
                                    onChangeText={ (value) => onChange(value, 'firstName')}
                                    enterKeyHint='next'
                                    autoComplete='name'
                                    error={error?.input === 'firstName'}
                                    onSubmitEditing={ () => lastNameRef.current && lastNameRef.current.focus()}
                                />

                                <TextInput
                                    innerRef={lastNameRef}
                                    id='lastName'
                                    autoComplete='family-name'
                                    placeholder="Last Name" 
                                    autoCapitalize="words"
                                    style={[styles.nameField]}
                                    value={lastName}
                                    onChangeText={ (value) => onChange(value, 'lastName')}
                                    enterKeyHint='next'
                                    error={error?.input === 'lastName'}
                                    onSubmitEditing={ () => emailRef.current && emailRef.current.focus()}
                                />
                            </View>


                            <TextInput
                                placeholder="Email"
                                autoComplete='email'
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={ false }
                                spellCheck={false}
                                style={[ error?.input === 'email' && { borderColor: 'red' }]}
                                value={email}
                                onChangeText={ (value) => onChange(value, 'email')}
                                enterKeyHint='next'
                                innerRef={emailRef}
                                error={error?.input === 'email'}
                                onSubmitEditing={ () => passwordRef.current && passwordRef.current.focus()}
                            />
                    
                            <TextInput
                                placeholder="Password"
                                autoComplete='password'
                                keyboardType="visible-password"
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={ false }
                                style={[ error?.input === 'password' && { borderColor: 'red' }]}
                                value={password}
                                onChangeText={ (value) => onChange(value, 'password')}
                                innerRef={passwordRef}
                                enterKeyHint='next'
                                error={error?.input === 'password'}
                                onSubmitEditing={modalHandler}
                            />

                            <TextInput
                                placeholder="Position"
                                keyboardType="default"
                                autoCapitalize="none"
                                value={position}
                                editable={false}
                                autoCorrect={ false }
                                onTouchStart={modalHandler}
                                error={error?.input === 'position'}
                                innerRef={positionRef}
                            />

                            <View>
                                <BottomModal 
                                    transparent={true}
                                    visible={showModal}
                                    animationType='fade'
                                    modalHeight={'50%'}
                                >
                                    <PositionPicker
                                        style={{flex:1}} 
                                        position={position}
                                        onSelectPosition={handleSelection}
                                    />
                                </BottomModal>
                            </View>

                            {/* Button to submit */}
                            <Button loading={loading} onPress={handleRegister} disabled={loading}>
                                <Text style={commonStyles.buttonText}>Create account</Text>
                            </Button>
                        </View>

                        {/* <View></View> */}
                    </Animated.View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <Text style={{color:'red', textAlign:'center', marginTop:20}}>{error?.message ?? ' '}</Text>
        {/* Link to login */}
        {
            // Hide link when keyboard is active, because it cause some problems on android
            !keyboardActive && (
                <Animated.View style={{opacity}}>
                    <Text style={{textAlign: 'center', color: 'grey', fontSize: 16}}>Already have an account? <Text style={{color: '#005B41', fontWeight: '600'}} onPress={navigateToLogin}>Login</Text></Text>
                </Animated.View>
            )
        }
        </>
    );
};


const styles = StyleSheet.create({
    nameField: {
        minWidth: 160,
        width: '48%',
    },
    nameContainer: {
        backgroundColor: 'transparent',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});


export default register;