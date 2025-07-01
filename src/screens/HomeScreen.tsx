import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';
import { PushNotificationService } from '../services/PushNotificationService';
import NotificationIcon from '../components/NotificationIcon'; 
import { formatBriefTimestamp } from '../utils/dateUtils'; 

export default function HomeScreen(){
  const { 
    notifications, 
    clearAllNotifications 
  } = useNotificationStore();

  //obtener la última notificación
  const latestNotification = notifications.length > 0 ? notifications[notifications.length - 1] : null;

  //genero notificaciones aleatorias
  const generateRandomNotification = () => {
    const notificationTypes = [
      {
        type: 'payment',
        titles: ['Pago Recibido', 'Cobro Exitoso', 'Depósito Bancario'],
        messages: [
          'Alan te envió $750 por Mercado Pago',
          'Recibiste $1,200 de Alan',
          'Tu salario de $50,000 fue depositado',
          'Alan te pagó $300 por la cena'
        ]
      },
      {
        type: 'transfer',
        titles: ['Transferencia Enviada', 'Transferencia Recibida', 'Movimiento Bancario'],
        messages: [
          'Transferiste $500 a Alan',
          'Recibiste una transferencia de $2,000',
          'Pago de servicios procesado: $450',
          'Transferencia internacional completada'
        ]
      },
      {
        type: 'security',
        titles: ['Alerta de Seguridad', 'Nuevo Inicio de Sesión', 'Dispositivo Detectado'],
        messages: [
          'Nuevo dispositivo iPhone 15 detectado',
          'Inicio de sesión desde Buenos Aires',
          'Intento de acceso desde IP desconocida',
          'Cambio de contraseña requerido'
        ]
      },
      {
        type: 'system',
        titles: ['Actualización del Sistema', 'Mantenimiento', 'Notificación del Sistema'],
        messages: [
          'Actualización disponible v2.1.0',
          'Mantenimiento programado para hoy',
          'Nuevas funciones desbloqueadas',
          'Respaldo de datos completado'
        ]
      },
      {
        type: 'default',
        titles: ['Recordatorio', 'Información General', 'Notificación'],
        messages: [
          'No olvides revisar tu perfil',
          'Mensaje importante del equipo',
          'Bienvenido a Alert App',
          'Gracias por usar nuestra aplicación'
        ]
      }
    ];

    //tipo aleatorio
    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const randomTitle = randomType.titles[Math.floor(Math.random() * randomType.titles.length)];
    const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];

    console.log(`Generando notificación aleatoria de tipo: ${randomType.type}`);
    
    //enviar notificación usando el servicio
    PushNotificationService.showLocalNotification(randomTitle, randomMessage);
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  return (
    <View style={styles.container}>

      {latestNotification ? (
        <View style={styles.notificationContainer}>
          <View style={styles.notificationRow}>
            <NotificationIcon 
              type={latestNotification.type} 
              isRead={latestNotification.isRead}
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{latestNotification.title}</Text>
              <Text style={styles.notificationDescription}>{latestNotification.description}</Text>
              <Text style={styles.notificationTimestamp}>
                {formatBriefTimestamp(latestNotification.timestamp)}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.noNotifications}>No hay notificaciones</Text>
      )}

      {/* <Text style={styles.counter}>
        Notificaciones: {notifications.length}
      </Text> */}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6366F1' }]}
        onPress={generateRandomNotification}
      >
        <Text style={styles.buttonText}>Generar Notificación Aleatoria</Text>
      </TouchableOpacity>

      {notifications.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
        >
          <Text style={styles.clearButtonText}>Limpiar Todo ({notifications.length})</Text>
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
    textAlign: 'center',
    fontWeight: 'bold',
  },
  notificationContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  notificationDescription: {
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  noNotifications: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  counter: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
  clearButton: {
    padding: 15,
    backgroundColor: '#f44336',
    marginTop: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});

