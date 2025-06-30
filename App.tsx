import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import HomeScreen from './src/screens/HomeScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import NotificationDetailScreen from './src/screens/NotificationDetailScreen';
import { useNotificationStore } from './src/store/notificationStore';
import NotificationBadge from './src/components/NotificationBadge';

export type RootStackParamList = {
  Home: undefined;
  Notifications: undefined;
  Details: { message: string };
  NotificationDetail: { notificationId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Alert App',
            headerRight: () => <NotificationBadge navigation={navigation} />
          })}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{ title: 'Notificaciones' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={{ title: 'Detalles' }}
        />
        <Stack.Screen 
          name="NotificationDetail" 
          component={NotificationDetailScreen}
          options={{ title: 'Detalle de Notificación' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
