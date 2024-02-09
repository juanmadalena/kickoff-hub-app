import BottomModal from '@/components/BottomModal';
import PositionPicker from '@/components/PositionPicker';
import { View, Text, TextInput } from '@/components/Themed';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useForm } from '@/hooks/useForm';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

const register = () => {

    const { register, status, error } = useContext(AuthContext);
    const [ showModal, setShowModal ] = useState(false)

    const { firstName, lastName, username, position, email, password, onChange } = useForm({
        firstName: 'juan',
        lastName: 'madalena',
        username:'juanmadalena443',
        email: 'juanmadlena2e4@gmail.com',
        password: '12345678',
        position: 'GK',
    })

    const router = useRouter();

    const handleRegister = async () => {
        register({ firstName, lastName, username, email, password, position });
        if(status === 'authenticated'){
        }
    }

    useEffect(() => {
        if(status === 'authenticated'){
            router.navigate('/(app)/');
        }
    }, [status])


    const handleSelection = ( value: string ) => {
        onChange(value, 'position');
        setShowModal(false);
    }

    return (
        <View style={{flex:1}}>
            <KeyboardAvoidingView
                style={{flex:1}}
                behavior={ (Platform.OS === 'ios') ? 'padding': 'height' }
            >
                <View style={styles.formContainer}>
                    {/* <Text style={styles.label}>USername or Email</Text> */}
                    <TextInput
                        placeholder="First Name"
                        underlineColorAndroid="white"
                        autoCapitalize="none"
                        autoCorrect={ false }
                        onFocus={ () => console.log("focus")}
                        style={styles.inputField}
                        value={firstName}
                    />

                    <TextInput
                        placeholder="Last Name" 
                        underlineColorAndroid="white"
                        autoCapitalize="none"
                        autoCorrect={ false }
                        onFocus={ () => console.log("focus") }
                        style={styles.inputField}
                        value={lastName}
                    />

                    <TextInput
                        placeholder="Username"
                        underlineColorAndroid="white"
                        autoCapitalize="none"
                        autoCorrect={ false }
                        onFocus={ () => console.log("focus") }
                        style={[styles.inputField, error?.input === 'username' && { borderColor: 'red' }]}
                        value={username}
                    />

                    <TextInput
                        placeholder="Email"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        autoCapitalize="none"
                        autoCorrect={ false }
                        onFocus={ () => console.log("focus") }
                        style={[styles.inputField, error?.input === 'email' && { borderColor: 'red' }]}
                        value={email}
                    />

                    <TextInput
                        placeholder="Password"
                        keyboardType="visible-password"
                        secureTextEntry={true}
                        underlineColorAndroid="white"
                        autoCapitalize="none"
                        autoCorrect={ false }
                        onFocus={ () => console.log("focus") }
                        style={[styles.inputField, error?.input === 'password' && { borderColor: 'red' }]}
                        value={password}
                    />

                    <TextInput
                        placeholder="Position"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={position}
                        editable={false}
                        autoCorrect={ false }
                        onTouchStart={ () => setShowModal(true) }
                        onFocus={ () => console.log("Abrir modal de posiciones") }
                        style={styles.inputField}
                    />
                    <View style={styles.inputField}>
                        <BottomModal 
                            transparent={true}
                            visible={showModal}
                            animationType='fade'
                        >
                            <PositionPicker
                                style={{flex:1}} 
                                position={position}
                                onSelectPosition={handleSelection}
                            />
                        </BottomModal>
                    </View>
                    <Text style={{color:'red'}}>{status}</Text>
                    <Text style={{color:'red'}}>{JSON.stringify(error)}</Text>
                    <Button title="Register" onPress={handleRegister} />

                </View>

            </KeyboardAvoidingView>
            <Text style={{textAlign:'center'}}>Already have an account?</Text>
            <Button title="Login" onPress={() => router.replace('/login')} />
        </View>
    );
};


const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent:'center',
        height: '100%',
        marginBottom: 50
    },
    inputField: {
        marginBottom: 15,
        borderColor: 'grey',
    },
});


export default register;