# ⚙️ Configuración Actual del Proyecto AlertApp

## 📋 Estado del Setup de Notificaciones Push

### ✅ Archivos Configurados

#### iOS Nativo:
- **ios/AlertApp/AppDelegate.m** - Configurado con todos los métodos requeridos
- **ios/Podfile** - Autolink habilitado
- **ios/AlertApp.xcodeproj/project.pbxproj** - Capabilities configuradas

#### JavaScript:
- **src/services/PushNotificationService.ts** - Servicio principal implementado
- **src/store/notificationStore.ts** - Store de Zustand configurado
- **App.tsx** - Inicialización y navegación configurada
- **src/screens/HomeScreen.tsx** - Botones de prueba implementados

### ✅ Funcionalidades Implementadas

1. **Notificaciones Locales** ✅
   - Botón verde: Notificaciones inmediatas en primer plano
   - Botón naranja: Notificaciones con temporizador para background

2. **Almacenamiento en Zustand** ✅
   - Agregar notificaciones automáticamente
   - Badge counter en header
   - Estado persistente

3. **Configuración iOS Nativa** ✅
   - AppDelegate.m configurado para mostrar banners en primer plano
   - Métodos de callback implementados
   - Permisos de notificación habilitados

### 📱 Bundle ID del Proyecto
```
org.reactjs.native.example.AlertApp
```

### 🔍 Debugging

Si las notificaciones no funcionan:

1. **Verificar permisos en iOS Simulator:**
   - Configuración → Notificaciones → AlertApp → Permitir notificaciones ✅

2. **Revisar logs en Metro:**

3. **Verificar app instalada:**
   ```bash
   xcrun simctl listapps booted | grep AlertApp
   ```

4. **Probar payload simple:**
   ```bash
   echo '{"aps":{"alert":"Test","sound":"default"}}' | xcrun simctl push booted org.reactjs.native.example.AlertApp -
   ```

### 📂 Estructura de Archivos de Notificaciones

```
src/
├── services/
│   ├── PushNotificationService.ts    # Servicio principal
│   └── NotificationService.ts        # Servicio legacy (opcional)
├── store/
│   └── notificationStore.ts          # Store de Zustand
├── types/
│   └── notification.ts               # Interfaces TypeScript
└── screens/
    ├── HomeScreen.tsx                # Botones de prueba
    ├── NotificationsScreen.tsx       # Lista de notificaciones
    └── NotificationDetailScreen.tsx  # Detalle individual

ios/AlertApp/
├── AppDelegate.m                     # Configuración nativa
└── Info.plist                       # Configuración automática

Testing/
├── send-test-notification.sh         # Script de prueba
└── test-notification.json           # Payload de ejemplo
```

----------------------------------------------------------------------------------------

# 🔔 Setup de React Native Push Notifications

Esta documentacion explica cómo está configurado el sistema de notificaciones push en la aplicación AlertApp usando `react-native-push-notification`.

## 📦 Dependencias Instaladas

```json
{
  "react-native-push-notification": "^8.1.1",
  "@react-native-community/push-notification-ios": "^1.11.0"
}
```

### Instalación de dependencias:
```bash
npm install react-native-push-notification @react-native-community/push-notification-ios
cd ios && pod install
```

## ⚙️ Configuración iOS

### 1. AppDelegate.m
El archivo `ios/AlertApp/AppDelegate.m` está configurado con los siguientes imports y métodos:

```objective-c
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
// Imports para notificaciones push
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"AlertApp";
  self.initialProps = @{};

  // Configurar el delegado de notificaciones
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Métodos requeridos para notificaciones push

// Para notificaciones remotas
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

// Para mostrar notificaciones en PRIMER PLANO
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // Forzar que SIEMPRE muestre banners, incluso en primer plano
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

// Para manejar el toque de una notificación
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}

// Para notificaciones locales (cuando la app está cerrada)
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
 [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

@end
```

### 2. Capabilities en Xcode
En Xcode, en tu target de la app, asegúrate de tener habilitado:
- **Push Notifications** en la pestaña "Signing & Capabilities"

### 3. Info.plist
Se agregaron automáticamente las configuraciones necesarias durante la instalación.

## 🔧 Configuración JavaScript

### 1. PushNotificationService.ts
El servicio principal está en `src/services/PushNotificationService.ts`:

```typescript
import PushNotification from 'react-native-push-notification';
import { useNotificationStore } from '../store/notificationStore';

export class PushNotificationService {
  static configure() {
    PushNotification.configure({
      onNotification: function (notification) {
        // Callback cuando llega una notificación
        const { addNotification } = useNotificationStore.getState();
        
        // Agregar al store de Zustand
        const notificationData = {
          title: notification.title || 'Notificación',
          description: notification.message || notification.body || 'Nueva notificación',
          data: notification.data || notification.userInfo || {}
        };
        
        if (notification.userInteraction) {
          // La notificación fue tocada - navegar al detalle
          // Lógica de navegación aquí
        } else {
          // Solo agregar al store
          addNotification(notificationData);
        }
      },

      onRegister: function(token) {
        console.log('TOKEN:', token);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      requestPermissions: true,
      popInitialNotification: true,
    });

    // Canal para Android
    PushNotification.createChannel({
      channelId: "default",
      channelName: "Default Channel",
      channelDescription: "Canal por defecto",
      soundName: "default",
      importance: 4,
      vibrate: true,
    });
  }

  static initialize() {
    this.configure();
    setTimeout(() => {
      this.requestPermissions();
    }, 1000);
  }

  static showLocalNotification(title: string, body: string) {
    const notification = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      message: body,
      playSound: true,
      soundName: 'default',
      userInfo: {
        id: `notif_${Date.now()}`,
        customData: 'test',
        timestamp: new Date().toISOString(),
      },
    };
    
    PushNotification.localNotification(notification);
    
    // Agregar manualmente al store para notificaciones en primer plano
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      title: notification.title,
      description: notification.message,
      data: notification.userInfo
    });
  }
}
```

### 2. Inicialización en App.tsx
```typescript
import { PushNotificationService } from './src/services/PushNotificationService';

const App = () => {
  const navigationRef = useRef();

  useEffect(() => {
    // Inicializar notificaciones
    PushNotificationService.initialize();
  }, []);

  const onNavigationReady = () => {
    PushNotificationService.setNavigationRef(navigationRef.current);
  };

  return (
    <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
      {/* Tu navegación */}
    </NavigationContainer>
  );
};
```

## 🧪 Testing y Simulación

### 1. Notificaciones Locales (desde la app)
```typescript
// Botón en HomeScreen.tsx
const handleSendNotification = () => {
  PushNotificationService.showLocalNotification(
    'Título de prueba',
    'Mensaje de prueba'
  );
};
```

## 🔍 Troubleshooting

### Problema: Los banners no aparecen
**Solución:**
1. Verificar permisos en Configuración → Notificaciones → AlertApp
2. Asegurar que `willPresentNotification` esté configurado en AppDelegate.m
3. Verificar que el Bundle ID sea correcto

### Problema: Notificaciones no navegan al detalle
**Solución:**
1. Verificar que `navigationRef` esté configurado
2. Revisar que el callback `onNotification` detecte `userInteraction`
3. Confirmar que la pantalla de destino existe en el stack de navegación

### Problema: Store de Zustand no se actualiza
**Solución:**
1. Agregar notificaciones manualmente cuando la app está en primer plano
2. Verificar que el callback `onNotification` se ejecute (logs)
3. Revisar la estructura de datos del payload

- ✅ Almacenamiento automático en Zustand store
- ✅ Navegación al detalle al tocar notificaciones
- ✅ Badge counter en el ícono de la app
- ✅ Notificaciones locales desde botones
- ✅ IDs únicos para evitar duplicados
- ✅ Permisos automáticos de notificación


