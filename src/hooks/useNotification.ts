/**
 * @file useNotification.ts
 * @description Hook to access NotificationContext.
 *
 * @see {@link ../context/notificationContextStore.ts}
 * @see {@link ../context/NotificationContext.tsx}
 * @see {@link ../components/NotificationBanner.tsx}
 * @see {@link ../components/UserList.tsx}
 * @see {@link ../components/UserForm.tsx}
 * @see {@link ../App.tsx}
 */

import { useContext } from "react";
import { NotificationContext } from "../context/notificationContextStore";

/**
 * Retrieves the NotificationContext value.
 *
 * It works by calling React's useContext with the NotificationContext.
 * If the context is undefined, it throws an error to ensure the hook is used
 * within a NotificationProvider. Otherwise, it returns the context value containing
 * notification state and actions.
 */
export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return context;
}
