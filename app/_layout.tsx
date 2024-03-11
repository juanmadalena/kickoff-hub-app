import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';

import { View } from '@/components/Themed';
import { AuthProvider } from '@/context/authContext/AuthContext';

const queryClient = new QueryClient();

const AppContext = ({children}: { children: JSX.Element | JSX.Element[]}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default function Root() {
    const colorScheme = useColorScheme();
    const { top } = useSafeAreaInsets();
    
    return (
        <AppContext>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <View style={{paddingTop:top + 10, flex:1}}>
                    <Slot />
                </View>
            </ThemeProvider>
        </AppContext>
    );
}