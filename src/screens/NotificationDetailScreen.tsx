import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';

type NotificationDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      notificationId: string;
    };
  };
};

const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({ navigation, route }) => {
  const { notificationId } = route.params;
  const { getNotificationById } = useNotificationStore();
  
  const notification = getNotificationById(notificationId);

  if (!notification) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Notificación no encontrada</Text>
        <TouchableOpacity
          style={{ padding: 15, backgroundColor: 'blue' }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        {notification.title}
      </Text>
      
      <Text style={{ fontSize: 16, marginBottom: 20, lineHeight: 24 }}>
        {notification.description}
      </Text>
      
      <Text style={{ fontSize: 14, color: 'gray', marginBottom: 10 }}>
        Fecha: {new Date(notification.timestamp).toLocaleString()}
      </Text>
      
      <Text style={{ fontSize: 14, color: 'gray', marginBottom: 10 }}>
        Tipo: {notification.type}
      </Text>
      
      <Text style={{ fontSize: 14, color: 'gray', marginBottom: 20 }}>
        Prioridad: {notification.priority}
      </Text>

      <TouchableOpacity
        style={{ padding: 15, backgroundColor: 'blue', marginTop: 'auto' }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationDetailScreen;
