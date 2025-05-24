# Notifications Feature

通知機能を提供するフィーチャーモジュールです。

## 構造

```
notifications/
├── components/
│   ├── NotificationItem/     # 個別の通知アイテムコンポーネント
│   ├── NotificationList/     # 通知リストコンポーネント
│   └── NotificationBadge/    # 通知バッジコンポーネント
├── data/
│   └── notifications-data.ts # モック通知データ
├── store/
│   └── notification.slice.ts # 通知状態管理（Zustand）
├── types/
│   └── notification.ts       # 通知関連の型定義
└── index.ts                  # Public API
```

## 主要な型

### Notification

```typescript
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
  imageType?: string;
}
```

### NotificationType

```typescript
type NotificationType =
  | "transaction" // 取引通知
  | "eco_impact" // 環境貢献通知
  | "campaign" // キャンペーン通知
  | "system" // システム通知
  | "security"; // セキュリティ通知
```

## 使用方法

### 通知リストの表示

```typescript
import { NotificationList, useNotificationStore } from "@/features/notifications";

function NotificationsPage() {
  const { notifications, markAsRead, setNotifications } = useNotificationStore();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // ナビゲーション処理
  };

  return (
    <NotificationList
      notifications={notifications}
      onNotificationClick={handleNotificationClick}
      onNotificationsUpdate={setNotifications}
    />
  );
}
```

### 通知バッジの表示

```typescript
import { NotificationBadge, useNotificationStore } from "@/features/notifications";

function Header() {
  const { getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  return (
    <div>
      <NotificationBadge count={unreadCount} />
    </div>
  );
}
```

## ストア機能

### アクション

- `setNotifications`: 通知リストを設定
- `addNotification`: 新しい通知を追加
- `markAsRead`: 通知を既読にする
- `markAllAsRead`: すべての通知を既読にする
- `deleteNotification`: 通知を削除
- `setLoading`: ローディング状態を設定
- `setError`: エラー状態を設定

### クエリ

- `getNotificationById`: IDで通知を取得
- `getNotificationsByType`: タイプで通知をフィルタリング
- `getUnreadCount`: 未読数を取得

## 通知タイプごとのスタイリング

各通知タイプには専用のアイコンと色が設定されています：

- **transaction**: 青色、ShoppingBagアイコン
- **eco_impact**: ティール色、Leafアイコン
- **campaign**: アンバー色、Megaphoneアイコン
- **security**: 赤色、AlertTriangleアイコン
- **system**: グレー色、Bellアイコン
