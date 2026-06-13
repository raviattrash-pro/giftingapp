import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],

  get unreadCount() {
    return get().notifications.filter(n => !n.read).length;
  },

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },

  addNotification: (type, title, message) => {
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    set(state => ({
      notifications: [notification, ...state.notifications]
    }));
    return notification.id;
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
  },

  clearAll: () => set({ notifications: [] })
}));
