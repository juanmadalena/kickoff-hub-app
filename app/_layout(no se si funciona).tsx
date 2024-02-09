import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { SafeAreaView, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { AuthProvider } from '@/context/authContext/AuthContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: 'register',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//     ...FontAwesome.font,
//   });

//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return <RootLayoutNav />;
// }

const AppState = ({children}: { children: JSX.Element | JSX.Element[]}) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );

}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const background = Colors[colorScheme ?? 'light'].background;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <AppState> */}
        <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: background },
            }}
            initialRouteName='register'
            
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            {/* <Stack.Screen name="index" />
            <Stack.Screen name="match/[id]"  />
            <Stack.Screen name="profile" /> */}
            {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
          </Stack>
        </SafeAreaView>
      {/* </AppState> */}
    </ThemeProvider>
  );
}
