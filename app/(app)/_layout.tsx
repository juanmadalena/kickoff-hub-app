import { useContext, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import Colors from '@/constants/Colors';
import { AuthContext } from '@/context/authContext/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function App(){
    //context
    const { status } = useContext(AuthContext);

    useEffect(() => {
        console.log('useEffect', status)
        if(status !== 'checking'){
            console.log('Hiding splash screen', new Date().getSeconds(), new Date().getMilliseconds());
            SplashScreen.hideAsync()
        }
    }, [status]);


    //check if user is authenticated
    if(status === 'not-authenticated'){
        return <Redirect href='/login' />
    }

    if(status === 'authenticated'){
        return <AppNav />
    }


}

function AppNav(){
    const colorScheme = useColorScheme();

    const background = Colors[colorScheme ?? 'light'].background;

    return (
        <>
            <StatusBar hidden={true} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: background },
                }}
                initialRouteName='index'
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="profile" />
                {/* <Stack.Screen name="match/[id]" /> */}
            </Stack>
        </>
    )
}