/**
 * @file ConfirmationModal.tsx
 * @description Reusable confirmation modal dialog.
 *
 * @see {@link ./UserList.tsx}
 * @see {@link ../App.css}
 */

import type { ReactNode } from "react";

type ConfirmationModalProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonClassName?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Renders a reusable confirmation modal dialog.
 *
 * @description
 * This component operates as a controlled modal via the `open` prop. 
 * When `open` is true, it displays an overlay and a dialog box containing a title, message, 
 * and action buttons (Confirm and Cancel). It captures clicks on the overlay to trigger `onCancel`, 
 * but stops propagation on the modal card itself to prevent unwanted closures. 
 * While the `isConfirming` state is active, the buttons are disabled to prevent double submissions.
 */
export default function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmButtonClassName = "btn btn-danger",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="confirmation-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmButtonClassName}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
