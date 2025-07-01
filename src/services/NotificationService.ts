import { Alert } from 'react-native';
import { PushNotificationService } from './PushNotificationService';

interface NotificationServiceState {
  addNotification: ((notification: any) => void) | null;
  isInitialized: boolean;
}

const serviceState: NotificationServiceState = {
  addNotification: null,
  isInitialized: false,
};

const TEST_NOTIFICATION = {
  title: 'Tienes una nueva notificación',
  body: 'Alan te ha enviado una notificación de prueba',
};

const createNotification = (title: string, body: string) => {
  return {
    id: Date.now().toString(),
    title,
    description: body,
    timestamp: new Date(),
    isRead: false,
  };
};

export const initializeNotificationService = (
  addNotificationFn: (notification: any) => void,
): void => {
  serviceState.addNotification = addNotificationFn;
  serviceState.isInitialized = true;

  //inicializo el servicio de notificaciones push
  PushNotificationService.initialize();
};

export const simulateTestNotification = (): void => {
  if (serviceState.addNotification) {
    const notification = createNotification(
      TEST_NOTIFICATION.title,
      TEST_NOTIFICATION.body,
    );

    //muestro alert nativo
    Alert.alert(notification.title, notification.description);
     
    //lo agrego al store de zustand
    serviceState.addNotification(notification);

    //muestro notificación push real del sistema
    PushNotificationService.showLocalNotification(
      notification.title,
      notification.description,
    );
  }
};
