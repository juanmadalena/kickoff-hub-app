import { SafeAreaView, useColorScheme } from 'react-native';
import { Slot } from 'expo-router';

import { AuthProvider } from '@/context/authContext/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Colors from '@/constants/Colors';

const AppContext = ({children}: { children: JSX.Element | JSX.Element[]}) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}

export default function Root() {
    const colorScheme = useColorScheme();

    const background = Colors[colorScheme ?? 'light'].background;
    
    return (
        <AppContext>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SafeAreaView style={{backgroundColor: background, flex: 1}}>
                    <Slot />
                </SafeAreaView>
            </ThemeProvider>
        </AppContext>
    );
}