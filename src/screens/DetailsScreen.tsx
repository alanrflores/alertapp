import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNotificationStore } from '../store/notificationStore';
import NotificationIcon from '../components/NotificationIcon';

export default function DetailsScreen() {

  const navigation = useNavigation();
  const route = useRoute();
  const { notificationId } = route.params as { notificationId: string };
  
  const { getNotificationById, markAsRead } = useNotificationStore();
  const notification = getNotificationById(notificationId);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notificationId);
    }
  }, [notification, notificationId, markAsRead]);

  if (!notification) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Notificación no encontrada</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NotificationIcon 
          type={notification.type} 
          size={48}
          isRead={notification.isRead}
        />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.timestamp}>
            {new Date(notification.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>{notification.description}</Text>
        
        {notification.data && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Datos adicionales:</Text>
            <Text style={styles.dataText}>
              {JSON.stringify(notification.data, null, 2)}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  dataContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  dataTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
  backButton: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
});

