import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';
import { 
  initializeNotificationService,
  simulateTestNotification
} from '../services/NotificationService';

type HomeScreenProps = {
  navigation: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { addNotification, notifications, clearAllNotifications } = useNotificationStore();
  const latestNotification = notifications[notifications.length - 1];

  useEffect(() => {
    //limpio todas las notificaciones al inicializar
    clearAllNotifications();
    initializeNotificationService(addNotification);
  }, [addNotification, clearAllNotifications]);

  const handleSimulateNotification = () => {
    simulateTestNotification();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Alert App</Text>
      
      {/*mestro la ultima */}
      {latestNotification ? (
        <View style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>{latestNotification.title}</Text>
          <Text>{latestNotification.description}</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {new Date(latestNotification.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      ) : (
        <Text style={{ marginBottom: 20 }}>No hay notificaciones</Text>
      )}

      <TouchableOpacity
        style={{ padding: 15, backgroundColor: 'blue', marginBottom: 10 }}
        onPress={handleSimulateNotification}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Simular Notificación</Text>
      </TouchableOpacity>

      {notifications.length > 0 && (
        <TouchableOpacity
          style={{ padding: 15, backgroundColor: 'red', marginBottom: 10 }}
          onPress={handleClearAll}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Limpiar Todas</Text>
        </TouchableOpacity>
      )}

      {notifications.length > 0 && (
        <TouchableOpacity
          style={{ padding: 15, backgroundColor: 'green' }}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Ver Todas ({notifications.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;
