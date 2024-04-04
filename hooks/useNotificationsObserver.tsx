import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

const useNotificationsObserver = () => {
    useEffect(() => {
        let isMounted = true;

        function handleRedirect(notification: Notifications.Notification) {
            if (isMounted) {
                router.navigate({ pathname: notification.request.content.data.url, params: notification.request.content.data.params })
            }
        }

        Notifications.getLastNotificationResponseAsync()
        .then((response) => {
            if (isMounted && response?.notification) {
                handleRedirect(response.notification);
            }
            return;
        });

        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            handleRedirect(response.notification);
        });

        return () => {
            isMounted = false;
            subscription.remove();
        };

    }, [])
};

export default useNotificationsObserver;