import {Alert} from 'react-native';

interface NotificationServiceState {
  addNotification: ((notification: any) => void) | null;
  isInitialized: boolean;
}

const serviceState: NotificationServiceState = {
  addNotification: null,
  isInitialized: false,
};

//notificación de prueba unica
const TEST_NOTIFICATION = {
  title: 'Notificación',
  body: 'esta es una prueba d enotificacion',
  type: 'info',
  priority: 'medium',
};

//creo objeto de notificación
const createNotification = (
  title: string,
  body: string,
  type: string = 'info',
  priority: string = 'medium',
) => {
  return {
    id: Date.now().toString(),
    title,
    description: body,
    type: type,
    priority: priority,
    timestamp: new Date(),
    isRead: false,
  };
};

//inicializo el servicio de notificaciones
export const initializeNotificationService = (
  addNotificationFn: (notification: any) => void,
): void => {
  serviceState.addNotification = addNotificationFn;
  serviceState.isInitialized = true;
};

//simulo una noti (demanda)
export const simulateTestNotification = (): void => {
  simulateNotification(
    TEST_NOTIFICATION.title,
    TEST_NOTIFICATION.body,
    TEST_NOTIFICATION.type,
    TEST_NOTIFICATION.priority,
  );
};

//simulo una notif específica
export const simulateNotification = (
  title: string,
  body: string,
  type: string = 'test',
  priority: string = 'medio',
): void => {
  if (!serviceState.addNotification) {
    console.warn('NotificationService no está inicializado');
    return;
  }

  const notification = createNotification(title, body, type, priority);

  //agrego al store
  serviceState.addNotification(notification);

  //mjuestro Alert para simular la noti
  Alert.alert(title, body, [
    {
      text: 'OK',
      onPress: () => console.log('Notificación vista'),
    },
  ]);
};
