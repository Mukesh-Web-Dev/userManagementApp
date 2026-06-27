/**
 * @file NotificationBanner.tsx
 * @description Global toast-style notification banner component.
 *
 * @see {@link ../App.tsx}
 * @see {@link ../hooks/useNotification.ts}
 * @see {@link ../context/NotificationContext.tsx}
 * @see {@link ../context/notificationContextStore.ts}
 */

import { useNotification } from "../hooks/useNotification";

/**
 * Renders a global toast-style notification banner.
 *
 * @description
 * This component hooks into the notification context using `useNotification`. 
 * It listens for any active notification state. If a notification exists, it renders 
 * an alert banner (styled based on the notification type) and provides a dismiss button 
 * that triggers `clearNotification` to close the banner. If no notification is present, 
 * it renders nothing (`null`).
 */
export default function NotificationBanner() {
  const { notification, clearNotification } = useNotification();

  if (!notification) return null;

  return (
    <div className={`notification-banner ${notification.type}`} role="status">
      <div className="notification-card">
        <div className="notification-content">{notification.message}</div>
        <button
          type="button"
          className="notification-close"
          onClick={clearNotification}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
