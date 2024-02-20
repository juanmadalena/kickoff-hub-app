import { SafeAreaView, useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { AuthProvider } from '@/context/authContext/AuthContext';
import { MatchesProvider } from '@/context/matchesContext/MatchesContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Colors from '@/constants/Colors';

const queryClient = new QueryClient();

const AppContext = ({children}: { children: JSX.Element | JSX.Element[]}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MatchesProvider>
                    {children}
                </MatchesProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default function Root() {
    const colorScheme = useColorScheme();

    const background = Colors[colorScheme ?? 'light'].background;
    
    return (
        <AppContext>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SafeAreaView style={{backgroundColor: background, flex: 1}} >
                    <Slot />
                </SafeAreaView>
            </ThemeProvider>
        </AppContext>
    );
}