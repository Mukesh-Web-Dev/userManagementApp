/**
 * @file UserList.tsx — Full User Listing Page with CRUD Actions
 *
 * Renders the complete list of users in a responsive card grid. Each card
 * exposes View, Edit, and Delete actions.
 *
 * @see {@link ../hooks/useUserContext.ts}
 * @see {@link ../hooks/useNotification.ts}
 * @see {@link ../context/UserContext.tsx}
 * @see {@link ../types.ts}
 * @see {@link ./ConfirmationModal.tsx}
 * @see {@link ./SkeletonLoader.tsx}
 * @see {@link ./UserDetail.tsx}
 * @see {@link ./UserForm.tsx}
 * @see {@link ../App.tsx}
 *
 * @module components/UserList
 */

import { useState, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import type { User } from "../types";
import { API_BASE_URL } from "../types";
import ConfirmationModal from "./ConfirmationModal";
import SkeletonLoader from "./SkeletonLoader";
import { useNotification } from "../hooks/useNotification";
import { useUserContext } from "../hooks/useUserContext";

const UserCardItem = memo(({ 
  user, 
  onDelete 
}: { 
  user: User; 
  onDelete: (id: number) => void 
}) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>

      <div className="card-actions">
        <Link to={`/user/${user.id}`} className="btn">
          View
        </Link>
        <Link to={`/edit/${user.id}`} className="btn btn-secondary">
          Edit
        </Link>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

/**
 * Renders the full list of users with management capabilities.
 * It connects to the UserContext to fetch users and handles local states
 * for the deletion confirmation modal and API requests for user removal.
 */
export default function UserList() {
  const { users, loading, error, refreshUsers, deleteUser } = useUserContext();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { notify } = useNotification();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const confirmDelete = async () => {
    if (pendingDeleteId === null || isDeleting) return;

    const deleteId = pendingDeleteId;
    setIsDeleting(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${API_BASE_URL}/${deleteId}`, {
        method: "DELETE",
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Server rejected deletion.");

      deleteUser(deleteId);
      notify("User deleted successfully.", "success");
    } catch (deleteError) {
      if (deleteError instanceof Error && deleteError.name === "AbortError") return;
      notify(
        deleteError instanceof Error ? deleteError.message : "Unable to delete user.",
        "error"
      );
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  if (loading) return <SkeletonLoader count={6} />;

  if (error) {
    return (
      <div className="error-banner">
        <p>Error: {error}</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => void refreshUsers()}
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="list-header">
        <div>
          <h2>Manage Users</h2>
        </div>
        <Link to="/create" className="btn btn-primary">
          Create New User
        </Link>
      </div>

      <div className="user-grid">
        {users.length === 0 ? (
          <div className="user-card empty-card">
            <h3>No users available yet</h3>
            <p className="page-description">
              The user list is empty. Try creating a new user or refresh the page.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <UserCardItem 
              key={user.id} 
              user={user} 
              onDelete={setPendingDeleteId} 
            />
          ))
        )}
      </div>

      <ConfirmationModal
        open={pendingDeleteId !== null}
        title="Delete this user?"
        message="This action will remove the selected profile from the list."
        confirmLabel="Delete"
        cancelLabel="Keep user"
        isConfirming={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
