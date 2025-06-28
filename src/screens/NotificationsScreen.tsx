import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';

type NotificationsScreenProps = {
  navigation: any;
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { notifications, markAsRead } = useNotificationStore();

  const handleNotificationPress = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    navigation.navigate('NotificationDetail', { notificationId: notification.id });
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ 
        padding: 15, 
        backgroundColor: item.isRead ? '#f9f9f9' : '#fff', 
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: item.isRead ? '#ccc' : '#007bff'
      }}
      onPress={() => handleNotificationPress(item)}
    >
      <Text style={{ fontWeight: item.isRead ? 'normal' : 'bold', fontSize: 16 }}>
        {item.title}
      </Text>
      <Text style={{ color: '#666', marginTop: 5 }}>
        {item.description}
      </Text>
      <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Notificaciones ({notifications.length})
      </Text>
      
      {notifications.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
          No hay notificaciones
        </Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default NotificationsScreen;
