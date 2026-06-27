/**
 * @file UserDetail.tsx — Read-Only User Profile View
 *
 * Displays a single user's profile information. Uses a cache-first approach
 * via UserContext before falling back to the API.
 *
 * @see {@link ../types.ts}
 * @see {@link ../hooks/useUserContext.ts}
 * @see {@link ../context/UserContext.tsx}
 * @see {@link ./UserList.tsx}
 * @see {@link ./UserForm.tsx}
 * @see {@link ../App.tsx}
 *
 * @module components/UserDetail
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { User } from "../types";
import { useUserContext } from "../hooks/useUserContext";

/**
 * Renders the detailed profile view of a single user.
 * It attempts to fetch the user from the local UserContext cache first,
 * falling back to an API request if the user is not found locally.
 */
export default function UserDetail() {
  const { id } = useParams();
  const { getUserById } = useUserContext();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect hook to load user details when the component mounts or the ID changes.
   * It checks the context cache for the user first, and if absent, fetches the data
   * from the remote API, managing loading and error states accordingly.
   */
  useEffect(() => {
    /**
     * Executes the process of retrieving user data.
     * It resolves the data from the context if available; otherwise, it performs
     * a fetch request to the API, parses the JSON, and updates the local state.
     */
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError("Invalid user selected.");
        setLoading(false);
        return;
      }

      const cachedUser = getUserById(id);
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!response.ok) throw new Error("User details could not be loaded.");

        const data: User = await response.json();
        setUser(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [getUserById, id]);

  if (loading) return <div className="spinner">Loading user details...</div>;

  if (error || !user) {
    return (
      <div className="form-container">
        <div className="error-banner">
          <p>{error || "User not found."}</p>
        </div>
        <Link to="/users" className="btn btn-secondary">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{user.name}&apos;s Profile</h2>

      <div className="detail-group">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
      </div>

      <Link to="/users" className="btn btn-secondary">
        Back to Users
      </Link>
    </div>
  );
}
