import { StateCreator } from "zustand";
import { create } from "zustand";
import { Notification } from "../types/notification";
import { notificationsData } from "../data/notifications-data";

/**
 * Notification スライスの型定義
 */
export interface NotificationSlice {
  // データ
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;

  // アクション
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // クエリ
  getNotificationById: (id: string) => Notification | undefined;
  getNotificationsByType: (type: string) => Notification[];
  getUnreadCount: () => number;
}

/**
 * Notification スライスの作成関数
 */
export const createNotificationSlice: StateCreator<
  NotificationSlice,
  [],
  [],
  NotificationSlice
> = (set, get) => ({
  // 初期状態
  notifications: notificationsData,
  isLoading: false,
  error: null,

  // 通知リストを設定
  setNotifications: (notifications) => {
    set({ notifications });
  },

  // 新しい通知を追加
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },

  // 通知を既読にする
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    }));
  },

  // すべての通知を既読にする
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  // 通知を削除
  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // ローディング状態を設定
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // エラー状態を設定
  setError: (error) => {
    set({ error });
  },

  // IDで通知を取得
  getNotificationById: (id) => {
    return get().notifications.find((n) => n.id === id);
  },

  // タイプで通知をフィルタリング
  getNotificationsByType: (type) => {
    return get().notifications.filter((n) => n.type === type);
  },

  // 未読数を取得
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },
});

/**
 * 単独で使用可能な Notification ストアフック
 */
export const useNotificationStore = create<NotificationSlice>()((...a) => ({
  ...createNotificationSlice(...a),
}));
