import { useContext, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AuthContext } from '@/context/authContext/AuthContext';
import { useFonts } from 'expo-font';
import TopBarNavigator from '@/components/TopBarNavigator';
import TopBarProfile from '@/components/TopBarProfile';

SplashScreen.preventAutoHideAsync();

export default function App(){
    //context
    const { status } = useContext(AuthContext);

    // const [ loaded, error ] = useFonts({
    //     'Montserrat': require('@/assets/fonts/Montserrat-Regular.ttf'),
    // });

    const loaded = true;

    //hide splash screen
    useEffect(() => {
        console.log('status', status);
        if(status !== 'checking' && loaded){
            SplashScreen.hideAsync()
        }
    }, [status, loaded]);


    //check if user is authenticated
    if(status === 'not-authenticated'){
        return <Redirect href='/login' />
    }

    if(status === 'authenticated'){
        return <AppNav />
    }


}

function AppNav(){

    return (
        <>
            <StatusBar />
            <Stack
                initialRouteName='(tabs)'
                screenOptions={{ animation: 'fade' }}
            >
                <Stack.Screen name="(tabs)" options={{ header: () => <TopBarProfile/> }}/>
                <Stack.Screen name="profile" options={{ headerShown: false }} />
                <Stack.Screen name="match/[id]" options={{ headerShown: false }} />
            </Stack>
        </>
    )
}