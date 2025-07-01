import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { useNotificationStore } from '../store/notificationStore';
import { 
  initializeNotificationService,
  simulateTestNotification
} from '../services/NotificationService';
import { PushNotificationService } from '../services/PushNotificationService';

const HomeScreen = () => {
  // Corregir: usar selectores específicos
  const notifications = useNotificationStore(state => state.notifications);
  const addNotification = useNotificationStore(state => state.addNotification);
  const clearAllNotifications = useNotificationStore(state => state.clearAllNotifications);
  
  // Obtener la última notificación
  const latestNotification = notifications[notifications.length - 1];
  
  const serviceInitialized = useRef(false);
  
    useEffect(() => {
    //inicializo notificaciones push cuando la app se monte
    PushNotificationService.initialize();
  }, []);

  // useEffect(() => {
  //   // Corregir: solo inicializar una vez
  //   if (!serviceInitialized.current) {
  //     clearAllNotifications();
  //     initializeNotificationService(addNotification);
  //     serviceInitialized.current = true;
  //   }
  // }, []); 

  // const handleSimulateNotification = () => {
  //   const notification = {
  //     title: 'Notificación de Prueba',
  //     description: 'Alan te envio dinero de prueba.',
  //   };
  //   addNotification(notification);
    
  // };

  const handleSimulateForegroundNotification = () => {
    console.log('Enviando notificación en PRIMER PLANO...');
    PushNotificationService.showLocalNotification(
      'Notificación Inmediata',
      'Esta notificacion debería aparecer con la app abierta.'
    );
  };

  const handleSimulateBackgroundNotification = () => {
    Alert.alert(
      'Notificación en 5 segundos',
      'Presiona ok y (Cmd+Shift+H) INMEDIATAMENTE. La notificación aparecerá en 5 segundos.',
      [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              console.log('¡ENVIANDO NOTIFICACIÓN AHORA!');
              PushNotificationService.showImmediateNotification(
                'Notificación Background',
                'Esta debería aparecer en modo background'
              );
            }, 5000); 
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alert App</Text>
      
      {/* muestro la última notificación */}
      {latestNotification ? (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>{latestNotification.title}</Text>
          <Text style={styles.notificationDescription}>{latestNotification.description}</Text>
          <Text style={styles.notificationTimestamp}>
            {new Date(latestNotification.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      ) : (
        <Text style={{ marginBottom: 20 }}>No hay notificaciones</Text>
      )}

      {/* pruebo notificaciones en primer plano */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'green' }]}
        onPress={handleSimulateForegroundNotification}
      >
        <Text style={styles.buttonText}>Probar Notificación Inmediata</Text>
      </TouchableOpacity>

      {/* pruebo notificaciones para background */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'orange' }]}
        onPress={handleSimulateBackgroundNotification}
      >
        <Text style={styles.buttonText}>Simular Background</Text>
      </TouchableOpacity>

      {notifications.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
        >
          <Text style={styles.clearButtonText}>Limpiar Todas ({notifications.length})</Text>
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
