/**
 * @file NotificationContext.tsx
 * @description NotificationProvider implementation.
 *
 * @see {@link ./notificationContextStore.ts}
 * @see {@link ../hooks/useNotification.ts}
 * @see {@link ../components/NotificationBanner.tsx}
 * @see {@link ../App.tsx}
 */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  NotificationContext,
  type Notification,
  type NotificationType,
} from "./notificationContextStore";

/**
 * Provides the notification state and actions to its children.
 *
 * It initializes a local state for the notification object. It defines functions
 * to set (notify) and clear (clearNotification) the notification. It also sets up
 * an effect to automatically clear the notification after a timeout.
 * These values are memoized and passed down via NotificationContext.Provider.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  /**
   * Sets a new notification to be displayed.
   *
   * Updates the local notification state with the provided message and type,
   * triggering a re-render to display the notification.
   */
  const notify = (message: string, type: NotificationType = "info") => {
    setNotification({ message, type });
  };

  /**
   * Clears the current notification.
   *
   * Sets the notification state to null, which unmounts or hides the active notification.
   */
  const clearNotification = () => setNotification(null);

  /**
   * Automatically clears the notification after a delay.
   *
   * When a notification is present, this effect sets a timeout for 4500ms.
   * Once the timeout expires, it clears the notification. It also returns a cleanup
   * function to clear the timeout if the component unmounts or the notification changes.
   */
  useEffect(() => {
    if (!notification) return;

    /**
     * Clears the notification state.
     * 
     * This timeout callback invokes setNotification with null to dismiss the active notification.
     */
    const timeout = window.setTimeout(() => {
      setNotification(null);
    }, 4500);

    /**
     * Cleans up the timeout.
     * 
     * This function is returned to React to clear the timeout when the effect re-runs or unmounts.
     */
    return () => window.clearTimeout(timeout);
  }, [notification]);

  /**
   * Memoizes the context value.
   *
   * Groups the current notification state and the action functions into an object.
   * The memoization prevents unnecessary re-renders of consuming components unless
   * the notification state changes.
   */
  const value = useMemo(
    /**
     * Constructs the memoized context value object.
     * 
     * Combines the notification state, notify function, and clearNotification function.
     */
    () => ({ notification, notify, clearNotification }),
    [notification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
