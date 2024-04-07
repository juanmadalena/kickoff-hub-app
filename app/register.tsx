import { useContext, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Animated, TextInput as DefaultTextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
import { Position } from '@/interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    position: string;
}

const register = () => {

    // Refs
    const lastNameRef = useRef<DefaultTextInput | null>(null)
    const emailRef = useRef<DefaultTextInput | null>(null)
    const passwordRef = useRef<DefaultTextInput | null>(null)
    const positionRef = useRef<DefaultTextInput | null>(null)

    const { register, status, error, removeError } = useContext(AuthContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ showLogin, setShowLogin ] = useState(true);
    const [ loading, setLoading ] = useState(false);
    const { bottom } = useSafeAreaInsets();

    const { fadeIn, fadeOut, opacity } = useFade();

    const { firstName, lastName, position, email, password, onChange } = useForm<RegisterForm>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        position: '',
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
            fadeOut(300, () => router.replace('/(app)/(tabs)'))
        }
    }, [status])

    const modalHandler = () => {
        Keyboard.addListener('keyboardDidHide', () => setShowModal(true));
        if(keyboardActive) {
            Keyboard.dismiss();
            return;
        }
        setShowModal(true);
        Keyboard.removeAllListeners('keyboardDidHide');
    }

    const handleSelection = ( value: string ) => {
        onChange(value, 'position');
        setShowLogin(true);
        setShowModal(false);
    }

    const navigateToLogin = () => { 
        fadeOut(100, () => router.replace('/login'))
    }

    return (
        <>
        {/* Logo */}
        <LogoImage />
        <KeyboardAvoidingView style={{flex:1, paddingHorizontal:20}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={180}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <Animated.View style={{ ...commonStyles.innerContainer ,opacity }}>
                        {/* Title */}   
                        <View style={commonStyles.titleContainer}>
                            <Text style={commonStyles.title}>Create an account</Text>
                            <Text style={commonStyles.subtitle}>Please fill the form to create an account</Text>
                        </View>

                        {/* Form */}
                        <View style={[commonStyles.formContainer, { height:'80%' }]}>

                            <View style={styles.nameContainer}>
                                <TextInput
                                    placeholder="First Name"
                                    autoCapitalize="words"
                                    containerStyle={[styles.nameField]}
                                    value={firstName}
                                    onFocus={() => setShowLogin(false)}
                                    onBlur={() => setShowLogin(true)}
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
                                    onFocus={() => setShowLogin(false)}
                                    onBlur={() => setShowLogin(true)}
                                    containerStyle={[styles.nameField]}
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
                                value={email}
                                onChangeText={ (value) => onChange(value, 'email')}
                                onFocus={() => setShowLogin(false)}
                                onBlur={() => setShowLogin(true)}
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
                                onFocus={() => setShowLogin(false)}
                                onBlur={() => setShowLogin(true)}
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
                                onTouchStart={() => Keyboard.dismiss()}
                                onTouchEnd={() => { 
                                    setShowModal(true) 
                                    setShowLogin(false) }}
                                error={error?.input === 'position'}
                                innerRef={positionRef}
                            />

                            <View>
                                {
                                    showModal &&
                                    <BottomModal
                                        duration={300}
                                        transparent={true}
                                        visible={showModal}
                                        animationType='fade'
                                        modalHeight={450}
                                    >
                                        <PositionPicker
                                            position={position as Position}
                                            onSelectPosition={handleSelection}
                                        />
                                    </BottomModal>
                                }
                            </View>

                            {/* Button to submit */}
                            <Button style={{marginTop:18}} loading={loading} onPress={handleRegister} disabled={loading}>
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
            !keyboardActive && showLogin &&(
                <View style={{width:'100%', position: 'absolute', alignItems:'center', bottom: bottom + 20}}>
                    <Animated.View style={{opacity}}>
                        <Text style={{textAlign: 'center', color: 'grey', fontSize: 16}}>Already have an account? <Text style={{color: '#005B41', fontWeight: '600'}} onPress={navigateToLogin}>Login</Text></Text>
                    </Animated.View>
                </View>
            )
        }
        </>
    );
};


const styles = StyleSheet.create({
    nameField: {
        minWidth: 160,
        width: '49%',
    },
    nameContainer: {
        backgroundColor: 'transparent',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});


export default register;