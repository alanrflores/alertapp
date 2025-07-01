import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  DollarSign, 
  ArrowLeftRight, 
  Shield, 
  Settings, 
  Bell 
} from 'lucide-react-native';
import { NotificationType } from '../types/notification';

interface NotificationIconProps {
  type?: NotificationType;
  size?: number;
  isRead?: boolean;
}

export default function NotificationIcon({ 
  type = 'default', 
  size = 24,
  isRead = false 
}: NotificationIconProps) {
    
  const getIconAndColor = () => {
    switch (type) {
      case 'payment':
        return { 
          Icon: DollarSign, 
          color: isRead ? '#4CAF50' : '#2E7D32',
          backgroundColor: isRead ? '#E8F5E8' : '#C8E6C9'
        };
      case 'transfer':
        return { 
          Icon: ArrowLeftRight, 
          color: isRead ? '#2196F3' : '#1565C0',
          backgroundColor: isRead ? '#E3F2FD' : '#BBDEFB'
        };
      case 'security':
        return { 
          Icon: Shield, 
          color: isRead ? '#FF9800' : '#F57C00',
          backgroundColor: isRead ? '#FFF3E0' : '#FFE0B2'
        };
      case 'system':
        return { 
          Icon: Settings, 
          color: isRead ? '#9C27B0' : '#7B1FA2',
          backgroundColor: isRead ? '#F3E5F5' : '#E1BEE7'
        };
      default:
        return { 
          Icon: Bell, 
          color: isRead ? '#757575' : '#424242',
          backgroundColor: isRead ? '#F5F5F5' : '#E0E0E0'
        };
    }
  };

  const { Icon, color, backgroundColor } = getIconAndColor();

  return (
    <View style={[styles.iconContainer, { backgroundColor }]}>
      <Icon 
        size={size} 
        color={color}
        strokeWidth={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
