import { useContext, useEffect, useState } from 'react';
import { SafeAreaView, useColorScheme, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { api } from '@/api/api';
import Colors from '@/constants/Colors';
import { AuthContext } from '@/context/authContext/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function App(){
    //context
    const { status } = useContext(AuthContext);

    //state
    // const [isDataFetched, setIsDataFetched] = useState(false);
    const [isFontsLoaded, setIsFontsLoaded] = useState(false);
    const [ isAppReady, setIsAppReady ] = useState(false);

    //fonts
    const [ loaded, error ] = useFonts({
        'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
    })

    //error handling
    useEffect(() => {
        if (error) throw error;
      }, [error]);

    //fetch matches
    // const fetchMatches = async () => {
    //     try{
    //         const {data} = await api.get("/matches");
    //     }
    //     catch(e){
    //         console.log("error", e);
    //     }
    //     finally{
    //         console.log("finally");
    //     }
    // }

    //fetch matches on load
    // useEffect(() => {
    //     console.log("fetching matches");
    //     fetchMatches();
    //     setIsDataFetched(true);
    // }, []);

    //check if fonts are loaded
    useEffect(() => {
        if(loaded){
            setIsFontsLoaded(true);
        }
    }, [loaded]);

    //hide splash screen when data is fetched and fonts are loaded
    useEffect(() => {
        // if(isDataFetched && isFontsLoaded && status !== "checking"){
        if(isFontsLoaded && status !== "checking"){
            SplashScreen.hideAsync();
        }
    }, [isFontsLoaded, status]);
// }, [isDataFetched, isFontsLoaded, status]);

    if(status === "not-authenticated" && isFontsLoaded){
        return <Redirect href="/register" />
    }else if( status === "authenticated" && isFontsLoaded){
        return <AppNav />
    }

}

function AppNav(){
    const colorScheme = useColorScheme();

    const background = Colors[colorScheme ?? 'light'].background;

    return (
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
    )
}