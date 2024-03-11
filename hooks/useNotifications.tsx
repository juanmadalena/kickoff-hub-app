import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    }),
});

// Notifications.scheduleNotificationAsync({
//     content: {
//       categoryIdentifier: 'match',
//       title: 'Notification Test😎',
//       body: 'Hello there!'
//     },
//     trigger: { seconds: 10 },
// });

const useNotifications = () => {

    const [expoPushToken, setExpoPushToken] = useState<string>();
    const [notification, setNotification] = useState<Notifications.Notification>();
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    useEffect(() => {
        Notifications.addPushTokenListener(handlePushToken);

        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            setNotification(response.notification);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current!);
          Notifications.removeNotificationSubscription(responseListener.current!);
        };
    }, []);

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.LOW,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });
        }
        
        const { status } = await Notifications.getPermissionsAsync();

        if (status !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
        }

        token = (await Notifications.getExpoPushTokenAsync({projectId:'b7617f76-809d-4d12-a8f4-d9ed98b40fa2'})).data;
        console.log(token);
        return token;
    }

    const handlePushToken = (token: Notifications.DevicePushToken) => {
        return;
    }

};

export default useNotifications;