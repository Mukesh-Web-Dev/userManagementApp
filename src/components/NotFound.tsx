/**
 * @file NotFound.tsx
 * @description 404 "Page Not Found" fallback component.
 *
 * @see {@link ../App.tsx}
 * @see {@link ./Home.tsx}
 */

import { Link } from "react-router-dom";

/**
 * Renders the 404 "Page Not Found" component.
 *
 * @description
 * This function returns a simple fallback UI when a user attempts to navigate to a route 
 * that has not been defined in the application's `Routes`. It presents a helpful error message 
 * and a link to guide the user back to the home page.
 */
export default function NotFound() {
  return (
    <div className="form-container notfound-card">
      <h2>Page Not Found</h2>
      <p className="page-description">
        The route you tried to access does not exist yet. Please return to the
        user dashboard or create a new record.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
