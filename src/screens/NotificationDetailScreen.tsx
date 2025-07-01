import React, { useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNotificationStore} from '../store/notificationStore';
import NotificationIcon from '../components/NotificationIcon';
import { formatDetailedTimestamp } from '../utils/dateUtils';

type NotificationDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      notificationId: string;
    };
  };
};

export default function NotificationDetailScreen({
  navigation,
  route,
}: NotificationDetailScreenProps) {
  const {notificationId} = route.params;
  const {getNotificationById, markAsRead} = useNotificationStore();

  const notification = getNotificationById(notificationId);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notificationId);
    }
  }, [notification, notificationId, markAsRead]);

  if (!notification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Notificación no encontrada</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonBack}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.containerTwo}>
      <View style={styles.header}>
        <NotificationIcon 
          type={notification.type} 
          size={32}
          isRead={notification.isRead}
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.typeLabel}>
            {notification.type ? notification.type.charAt(0).toUpperCase() + notification.type.slice(1) : 'General'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.descriptionLabel}>Descripción:</Text>
        <Text style={styles.description}>{notification.description}</Text>

        <Text style={styles.timestampLabel}>Fecha y Hora:</Text>
        <Text style={styles.timestamp}>
          {formatDetailedTimestamp(notification.timestamp)}
        </Text>

        {/* si existen, muestro datos adicionales */}
        {notification.data && Object.keys(notification.data).length > 0 && (
          <>
            <Text style={styles.dataLabel}>Información adicional:</Text>
            <View style={styles.dataContainer}>
              {Object.entries(notification.data).map(([key, value]) => (
                <Text key={key} style={styles.dataItem}>
                  <Text style={styles.dataKey}>{key}:</Text> {String(value)}
                </Text>
              ))}
            </View>
          </>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonBack}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTwo: {
    flex: 1, 
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 4,
    color: '#1a1a1a',
  },
  typeLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 16, 
    marginBottom: 20, 
    lineHeight: 24,
    color: '#333',
  },
  timestampLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 14, 
    color: '#666', 
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  dataContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  dataItem: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  dataKey: {
    fontWeight: '600',
    color: '#6366F1',
  },
  button: {
    padding: 15, 
    backgroundColor: '#6366F1', 
    marginTop: 20,
    borderRadius: 8,
  },
  buttonBack: {
    color: 'white', 
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
