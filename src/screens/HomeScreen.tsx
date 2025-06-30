import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Alert App</Text>

      {/*muestro la ultima */}
      {latestNotification ? (
        <View style={styles.notificationContainer}>
          <Text style={{ fontWeight: 'bold' }}>{latestNotification.title}</Text>
          <Text style={styles.notificationDescription}>{latestNotification.description}</Text>
          <Text style={styles.notificationTimestamp}>
            {new Date(latestNotification.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      ) : (
        <Text style={{ marginBottom: 20 }}>No hay notificaciones</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSimulateNotification}
      >
        <Text style={styles.buttonText}>Simular Notificación</Text>
      </TouchableOpacity>

      {notifications.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
        >
          <Text style={styles.clearButtonText}>Limpiar Todas</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  notificationContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  notificationTitle: {
    fontWeight: 'bold',
  },
  notificationDescription: {
    marginBottom: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  button: {
    padding: 15,
    backgroundColor: 'blue',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  clearButton: {
    padding: 15,
    backgroundColor: 'red',
    marginBottom: 10,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default HomeScreen;
