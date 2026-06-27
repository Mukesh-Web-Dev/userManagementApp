/**
 * @file App.tsx
 * @description Root application component setting up providers, routing, and layout.
 *
 * @see {@link ./main.tsx}
 * @see {@link ./App.css}
 * @see {@link ./context/NotificationContext.tsx}
 * @see {@link ./context/UserContext.tsx}
 * @see {@link ./components/Home.tsx}
 * @see {@link ./components/UserList.tsx}
 * @see {@link ./components/UserForm.tsx}
 * @see {@link ./components/UserDetail.tsx}
 * @see {@link ./components/NotFound.tsx}
 * @see {@link ./components/NotificationBanner.tsx}
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import UserDetail from "./components/UserDetail";
import NotificationBanner from "./components/NotificationBanner";
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/UserContext";
import "./App.css";

/**
 * Keyed wrapper to force remount on route parameter change.
 *
 * @description
 * This component uses the current route's pathname as a `key` prop on the `UserForm`.
 * By doing so, React is forced to unmount the previous instance of the form and remount 
 * a new one whenever the route changes (e.g., from `/create` to `/edit/123`), ensuring 
 * all local state is reset.
 */
function UserFormRoute() {
  const location = useLocation();
  return <UserForm key={location.pathname} />;
}

/**
 * Root Application component.
 *
 * @description
 * This component sets up the primary layout, navigation, and routing for the application.
 * It wraps the router and main content within global context providers (`NotificationProvider` and `UserProvider`).
 * This ensures that toast notifications and user data management are accessible throughout the component tree.
 */
export default function App() {
  return (
    <NotificationProvider>
      <UserProvider>
        <Router>
          <div className="app-container">
            <header className="app-header">
              <div className="header-copy">
                <h1>User Management</h1>
              </div>
              <nav className="header-nav">
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/users" className="nav-link nav-create">
                  Users
                </Link>
              </nav>
            </header>

            <NotificationBanner />

            <main className="page-body">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/create" element={<UserFormRoute />} />
                <Route path="/edit/:id" element={<UserFormRoute />} />
                <Route path="/user/:id" element={<UserDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </UserProvider>
    </NotificationProvider>
  );
}
