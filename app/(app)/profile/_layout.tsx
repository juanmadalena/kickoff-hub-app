import { Stack } from 'expo-router';

const profileLayout = () => {
    return (
        <Stack 
            initialRouteName='[id]'
            screenOptions={{ headerShown: false, animation: 'fade' }}
        >
            <Stack.Screen name='[id]' />
            <Stack.Screen name='settings' />
            <Stack.Screen name='(modals)/editBasicInfo' options={{ presentation: 'modal', animation:'fade_from_bottom' }} />
            <Stack.Screen name='(modals)/editEmail' options={{ presentation: 'modal', animation:'fade_from_bottom' }} />
            <Stack.Screen name='(modals)/editPassword' options={{ presentation: 'modal', animation:'fade_from_bottom' }} />
        </Stack>
    );
};

export default profileLayout;