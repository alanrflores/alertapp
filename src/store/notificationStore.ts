import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notification, NotificationState} from '../types/notification';

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: notification => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          isRead: false,
        };

        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: id => {
        set(state => {
          const updatedNotifications = state.notifications.map(notification =>
            notification.id === id
              ? {...notification, isRead: true}
              : notification,
          );

          const unreadCount = updatedNotifications.filter(
            n => !n.isRead,
          ).length;

          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
        }));
      },

      removeNotification: id => {
        set(state => {
          const notificationToRemove = state.notifications.find(
            n => n.id === id,
          );
          const filteredNotifications = state.notifications.filter(
            n => n.id !== id,
          );
          const unreadCount =
            notificationToRemove && !notificationToRemove.isRead
              ? state.unreadCount - 1
              : state.unreadCount;

          return {
            notifications: filteredNotifications,
            unreadCount: Math.max(0, unreadCount),
          };
        });
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      getNotificationById: id => {
        return get().notifications.find(notification => notification.id === id);
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      //solo persistir las notificaciones, recalcular unreadCount al cargar
      partialize: state => ({
        notifications: state.notifications,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          const unreadCount = state.notifications.filter(n => !n.isRead).length;
          state.unreadCount = unreadCount;
        }
      },
    },
  ),
);

// Acciones del store
export const useNotificationActions = () =>
  useNotificationStore(state => ({
    addNotification: state.addNotification,
    markAsRead: state.markAsRead,
    markAllAsRead: state.markAllAsRead,
    removeNotification: state.removeNotification,
    clearAllNotifications: state.clearAllNotifications,
    getNotificationById: state.getNotificationById,
  }));
