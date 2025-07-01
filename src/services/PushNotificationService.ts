import PushNotification from 'react-native-push-notification';
import { useNotificationStore } from '../store/notificationStore';
import { formatBriefTimestamp } from '../utils/dateUtils';

//variable para la referencia de navegación
let navigationRef: any = null;

export class PushNotificationService {
  static setNavigationRef(ref: any) {
    navigationRef = ref;
    console.log('NavigationRef configurado:', !!ref);
  }

  static configure() {
    console.log('configurando PushNotification...');

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('notification completa:', notification);
        //agrego al store
        const { addNotification } = useNotificationStore.getState();
        
        //determino tipo basado en el título o userInfo
        let notificationType = 'default';
        const title = notification.title || 'Notificación';
        const titleLower = title.toLowerCase();
        
        //verifico si el tipo viene en userInfo
        if (notification.userInfo?.type) {
          notificationType = notification.userInfo.type;
        } else if (notification.data?.type) {
          notificationType = notification.data.type;
        } else {
          // si no, lo determino por el título
          if (titleLower.includes('pago') || titleLower.includes('cobro') || titleLower.includes('depósito')) {
            notificationType = 'payment';
          } else if (titleLower.includes('transferencia') || titleLower.includes('movimiento') || titleLower.includes('bancario')) {
            notificationType = 'transfer';
          } else if (titleLower.includes('seguridad') || titleLower.includes('alerta') || titleLower.includes('sesión') || titleLower.includes('dispositivo')) {
            notificationType = 'security';
          } else if (titleLower.includes('sistema') || titleLower.includes('actualización') || titleLower.includes('mantenimiento')) {
            notificationType = 'system';
          }
        }
        
        const notificationData = {
          title: title,
          description: notification.message || notification.body || 'Nueva notificación',
          type: notificationType as any,
          data: notification.data || notification.userInfo || notification.customData || {}
        };
        
        let notificationId;
    
        if (notification.userInteraction) {      
          //usar el id único del userInfo para buscar la notificación
          const notificationIdFromUserInfo = notification.userInfo?.id;
          console.log('🔍 Buscando notificación con ID:', notificationIdFromUserInfo);
          
          //busco si ya existe en el store
          const { notifications } = useNotificationStore.getState();
          let existingNotification = notifications.find(n => {

            //busco por id o userinfo
            return n.data?.id === notificationIdFromUserInfo || 
                   n.title.includes(notificationData.title.replace(/ #\d+/, ''));
          });
          
          let notificationId;
          if (existingNotification) {
            notificationId = existingNotification.id;
            console.log('Notificación encontrada en store:', notificationId);
          } else {
            //no existe, crearla en el store
            addNotification(notificationData);
            console.log('Nueva notificación creada en store por toque');
            
            
            const { notifications: updatedNotifications } = useNotificationStore.getState();
            const newestNotification = updatedNotifications[0]; 
            notificationId = newestNotification?.id;
          }
          
          //navego al detalle
          if (navigationRef && notificationId) {
            console.log('🚀 Navegando al detalle:', notificationId);
            setTimeout(() => {
              navigationRef.navigate('NotificationDetail', { 
                notificationId: notificationId 
              });
            }, 500);
          }
        } else {
          //solo agrego al store (notificacion recibida, no tocada)
          addNotification(notificationData);
        }

        notification.finish && notification.finish();
      },

      //arego onRegister callback
      onRegister: function(token) {
        console.log('TOKEN REGISTRADO:', token);
      },

      //callback cuando hay error de registro
      onRegistrationError: function(err) {
        console.log('Error de registro:', err.message, err);
      },

      //cnfiguración de permisos
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      //solicito permisos
      requestPermissions: true,
      
      //config adicional
      popInitialNotification: true,
    });

    //creo canal para Android
    PushNotification.createChannel(
      {
        channelId: "default",
        channelName: "Default Channel",
        channelDescription: "A default channel for notifications",
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Canal creado: ${created}`)
    );
  }

  static async initialize() {
    console.log('Inicializando PushNotificationService...');
    this.configure();
    
    //solicito permisos explícitamente después de configurar
    setTimeout(() => {
      this.requestPermissions();
    }, 1000);
  }

  static requestPermissions() {
    console.log('Solicitando permisos explícitamente...');
    
    PushNotification.requestPermissions(['alert', 'badge', 'sound'])
      .then((permissions) => {
        console.log('Permisos explícitos concedidos:', permissions);
      })
      .catch((error) => {
        console.log('Error solicitando permisos explícitos:', error);
      });
  }

  static showLocalNotification(title: string, body: string) {
    console.log('Enviando notificación local INMEDIATA:', title, body);
    
    //determino tipo basado en el título de manera más robusta
    let notificationType = 'default';
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('pago') || titleLower.includes('cobro') || titleLower.includes('depósito')) {
      notificationType = 'payment';
    } else if (titleLower.includes('transferencia') || titleLower.includes('movimiento') || titleLower.includes('bancario')) {
      notificationType = 'transfer';
    } else if (titleLower.includes('seguridad') || titleLower.includes('alerta') || titleLower.includes('sesión') || titleLower.includes('dispositivo')) {
      notificationType = 'security';
    } else if (titleLower.includes('sistema') || titleLower.includes('actualización') || titleLower.includes('mantenimiento')) {
      notificationType = 'system';
    }

    const randomId = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().getSeconds();
    
    const notification = {
      //asigno un ID único para que cada notificación sea nueva
      id: `local_${Date.now()}_${randomId}`,

      title: `${title} #${timestamp}`,
      message: `${body}`,
      
      //config básica
      channelId: 'default',
      playSound: true,
      soundName: 'default',
      vibrate: true,
      vibration: 300,
      number: Math.floor(Math.random() * 5) + 1,
      
      //para que aparezca inmediatamente
      ongoing: false,
      priority: 'high',
      visibility: 'public',
      importance: 'high',
      
      //datos adicionales
      userInfo: {
        id: `notif_${Date.now()}_${randomId}`,
        customData: 'test',
        timestamp: new Date().toISOString(),
        originalTitle: title,
        type: notificationType
      },
      
      //para iOS
      category: 'test',
      
      //acciones
      actions: ['OK'],
    };
    
    console.log('Notificación inmediata:', notification);
    
    try {
      PushNotification.localNotification(notification);
      console.log('Notificación inmediata enviada');
      
      //agrego manualmente al store cuando la app está en primer plano
      const { addNotification } = useNotificationStore.getState();
      const notificationData = {
        title: notification.title,
        description: notification.message,
        type: notificationType as any,
        data: notification.userInfo || {}
      };
      addNotification(notificationData);
      console.log('Notificación agregada manualmente al store con tipo:', notificationType);
      
    } catch (error) {
      console.log('Error enviando notificación inmediata:', error);
    }
  }

  static scheduleLocalNotification(title: string, body: string, seconds: number = 3) {
    console.log(`Programando notificación para ${seconds} segundos...`);
    
    //determino tipo basado en el título de manera más robusta
    let notificationType = 'default';
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('pago') || titleLower.includes('cobro') || titleLower.includes('depósito')) {
      notificationType = 'payment';
    } else if (titleLower.includes('transferencia') || titleLower.includes('movimiento') || titleLower.includes('bancario')) {
      notificationType = 'transfer';
    } else if (titleLower.includes('seguridad') || titleLower.includes('alerta') || titleLower.includes('sesión') || titleLower.includes('dispositivo')) {
      notificationType = 'security';
    } else if (titleLower.includes('sistema') || titleLower.includes('actualización') || titleLower.includes('mantenimiento')) {
      notificationType = 'system';
    }
    
    const randomId = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().getSeconds();
    
    const notification = {
      id: `scheduled_${Date.now()}_${randomId}`,
      channelId: 'default',
      title: `${title} #${timestamp}`,
      message: `${body}`,
      //agrego más tiempo para que pueda salir de la app
      date: new Date(Date.now() + (seconds * 1000)),
      playSound: true,
      soundName: 'default',
      vibrate: true,
      vibration: 300,
      number: 1,
      priority: 'high',
      visibility: 'public',
      importance: 'high',
      userInfo: {
        id: `scheduled_${Date.now()}_${randomId}`,
        customData: 'test',
        timestamp: formatBriefTimestamp(new Date().toISOString()),
        originalTitle: title,
        type: notificationType
      }
    };
    
    console.log('Notificación programada para:', notification.date);
    
    try {
      PushNotification.localNotificationSchedule(notification);
      console.log('Notificación programada exitosamente');
    } catch (error) {
      console.log('Error programando notificación:', error);
    }
  }

  //método para verificar permisos
  static checkPermissions() {
    PushNotification.checkPermissions((permissions) => {
      console.log('Estado actual de permisos:', permissions);
      return permissions;
    });
  }

  static cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
    console.log('todas las notificaciones canceladas');
  }

  static showImmediateNotification(title: string, body: string) {
    console.log('enviando notificación INMEDIATA para background...');
    
    //determino tipo basado en el título de manera más robusta
    let notificationType = 'default';
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('pago') || titleLower.includes('cobro') || titleLower.includes('depósito')) {
      notificationType = 'payment';
    } else if (titleLower.includes('transferencia') || titleLower.includes('movimiento') || titleLower.includes('bancario')) {
      notificationType = 'transfer';
    } else if (titleLower.includes('seguridad') || titleLower.includes('alerta') || titleLower.includes('sesión') || titleLower.includes('dispositivo')) {
      notificationType = 'security';
    } else if (titleLower.includes('sistema') || titleLower.includes('actualización') || titleLower.includes('mantenimiento')) {
      notificationType = 'system';
    }
    
    const randomId = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().getSeconds();
    
    const notification = {
      //agrego ID único también aca
      id: `immediate_${Date.now()}_${randomId}`,
      
      title: `${title} #${timestamp}`,
      message: `${body} [${randomId}]`,
      
      //configuración mínima que funciona
      playSound: true,
      soundName: 'default',
      number: 1,
      
      userInfo: {
        id: `immediate_${Date.now()}_${randomId}`,
        customData: 'test',
        timestamp: formatBriefTimestamp(new Date().toISOString()),
        originalTitle: title,
        type: notificationType
      },
    };
    
    console.log('Notificación inmediata:', notification);
    
    try {
      PushNotification.localNotification(notification);
      console.log('Notificación inmediata enviada');
      
      //agrego manualmente al store también para las notificaciones de background
      //me aseguro que se guarde incluso si la app está en primer plano
      const { addNotification } = useNotificationStore.getState();
      const notificationData = {
        title: notification.title,
        description: notification.message,
        type: notificationType as any,
        data: notification.userInfo || {}
      };
      addNotification(notificationData);
      console.log('Notificación de background agregada manualmente al store con tipo:', notificationType);
      
    } catch (error) {
      console.log('Error enviando notificación inmediata:', error);
    }
  }
}