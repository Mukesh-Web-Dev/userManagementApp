/**
 * @file Home.tsx — Dashboard / Landing Page
 *
 * Renders the application's home screen with quick-action navigation links
 * and a preview grid showing up to 4 user cards from UserContext.
 *
 * @see {@link ../hooks/useUserContext.ts}
 * @see {@link ../context/UserContext.tsx}
 * @see {@link ../context/userContextStore.ts}
 * @see {@link ./UserList.tsx}
 * @see {@link ./UserForm.tsx}
 * @see {@link ../App.tsx}
 * @see {@link ../types.ts}
 *
 * @module components/Home
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";

/**
 * Renders the Home component containing quick actions and a preview of the user grid.
 * It retrieves the current list of users, loading state, and error state from the UserContext,
 * and displays up to the first four users as a preview.
 * 
 * Performance: The preview array slice is memoized to prevent creating a new array reference
 * on every render unless the source `users` array actually changes.
 */
export default function Home() {
  const { users, loading, error } = useUserContext();
  const previewUsers = useMemo(() => users.slice(0, 4), [users]);

  return (
    <div className="home-page">
      <section className="home-summary-card">
        <div className="home-summary-top">
          <div className="hero-actions">
            <Link to="/users" className="btn btn-secondary">
              View All Users
            </Link>
            <Link to="/create" className="btn btn-secondary">
              Create User
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="spinner">Loading users...</div>
        ) : error ? (
          <div className="error-banner">{error}</div>
        ) : (
          <div className="user-grid home-preview-grid">
            {previewUsers.map((user) => (
              <div key={user.id} className="user-card">
                <h3>{user.name}</h3>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
