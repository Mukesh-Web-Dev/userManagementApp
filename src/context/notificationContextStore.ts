/**
 * @file notificationContextStore.ts
 * @description NotificationContext and types.
 *
 * @see {@link ./NotificationContext.tsx}
 * @see {@link ../hooks/useNotification.ts}
 * @see {@link ../components/NotificationBanner.tsx}
 */

import { createContext } from "react";

export type NotificationType = "success" | "error" | "info";

export type Notification = {
  type: NotificationType;
  message: string;
};

export type NotificationContextValue = {
  notification: Notification | null;
  notify: (message: string, type?: NotificationType) => void;
  clearNotification: () => void;
};

export const NotificationContext = createContext<NotificationContextValue | null>(null);
