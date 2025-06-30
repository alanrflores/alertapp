import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useNotificationStore} from '../store/notificationStore';

type NotificationsScreenProps = {
  navigation: any;
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const {notifications, markAsRead} = useNotificationStore();

  const handleNotificationPress = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    navigation.navigate('NotificationDetail', {
      notificationId: notification.id,
    });
  };

  const renderNotification = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[
        styles.notificationTwoContainer,
        {
          backgroundColor: item.isRead ? '#f9f9f9' : '#fff',
          borderLeftColor: item.isRead ? '#ccc' : '#007bff',
        },
      ]}
      onPress={() => handleNotificationPress(item)}>
      <Text
        style={[
          styles.notificationTwoTitle,
          {fontWeight: item.isRead ? 'normal' : 'bold'},
        ]}>
        {item.title}
      </Text>
      <Text style={styles.notificationTwoDescription}>{item.description}</Text>
      <Text style={styles.notificationTwoTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones ({notifications.length})</Text>

      {notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>No hay notificaciones</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
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
  noNotificationsText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  notificationDescription: {
    marginBottom: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  notificationTwoContainer: {
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  notificationTwoTitle: {
    fontSize: 16,
  },
  notificationTwoDescription: {
    marginBottom: 5,
  },
  notificationTwoTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default NotificationsScreen;
