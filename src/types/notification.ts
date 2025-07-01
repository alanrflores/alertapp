export type NotificationType = 'payment' | 'transfer' | 'security' | 'system' | 'default';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  type?: NotificationType; 
  data?: any;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationById: (id: string) => Notification | undefined;
}
