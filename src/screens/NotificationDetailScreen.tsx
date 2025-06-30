import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNotificationStore} from '../store/notificationStore';

type NotificationDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      notificationId: string;
    };
  };
};

const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const {notificationId} = route.params;
  const {getNotificationById} = useNotificationStore();

  const notification = getNotificationById(notificationId);

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
      <Text style={styles.title}>{notification.title}</Text>

      <Text style={styles.description}>{notification.description}</Text>

      <Text style={styles.timestamp}>
        Fecha: {new Date(notification.timestamp).toLocaleString()}
      </Text>

      <Text style={styles.type}>Tipo: {notification.type}</Text>

      <Text style={styles.priority}>Prioridad: {notification.priority}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonBack}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  description: {fontSize: 16, marginBottom: 20, lineHeight: 24},
  timestamp: {fontSize: 14, color: 'gray', marginBottom: 10},
  type: {fontSize: 14, color: 'gray', marginBottom: 10},
  priority: {fontSize: 14, color: 'gray', marginBottom: 20},
  button: {padding: 15, backgroundColor: 'blue', marginTop: 'auto'},
  buttonBack: {color: 'white', textAlign: 'center'},
  containerTwo: {flex: 1, padding: 20},
});

export default NotificationDetailScreen;
