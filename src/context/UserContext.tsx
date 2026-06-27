/**
 * @file UserContext.tsx
 * @description UserProvider implementation.
 *
 * @see {@link ./userContextStore.ts}
 * @see {@link ../types.ts}
 * @see {@link ../hooks/useUserContext.ts}
 * @see {@link ../App.tsx}
 * @see {@link ../components/UserForm.tsx}
 * @see {@link ../components/UserList.tsx}
 * @see {@link ../components/UserDetail.tsx}
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User, UserFormData } from "../types";
import { API_BASE_URL } from "../types";
import { UserContext } from "./userContextStore";

const STORAGE_KEY = "user-management-users";

/**
 * Saves the current list of users to local storage.
 *
 * It checks if the window object exists to avoid SSR issues. Then it serializes
 * the users array to a JSON string and stores it in the browser's localStorage
 * under a specific storage key.
 */
function persistUsers(users: User[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * Reads the list of users from local storage.
 *
 * It checks for the window object, retrieves the JSON string from localStorage using
 * the storage key, and parses it back into an array of User objects. If parsing fails
 * or no data is found, it falls back to an empty array.
 */
function readStoredUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const savedUsers = window.localStorage.getItem(STORAGE_KEY);
    if (!savedUsers) return [];
    
    const parsed = JSON.parse(savedUsers);
    return Array.isArray(parsed) ? (parsed as User[]) : [];
  } catch {
    return [];
  }
}

/**
 * Provides user state and management functions to the application.
 *
 * Initializes state for users, loading, and error. It attempts to read initial users
 * from local storage and conditionally fetches from an API if no users are cached.
 * It provides functions to add, update, delete, and refresh users, keeping local storage
 * in sync via effects. Exposes all these through UserContext.Provider.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(
    /**
     * Initializes user state from local storage.
     *
     * Calls readStoredUsers to set the initial value of the users state synchronously.
     */
    () => readStoredUsers()
  );

  const [loading, setLoading] = useState<boolean>(
    /**
     * Initializes the loading state.
     *
     * Evaluates whether there is existing user data in local storage. If no data exists,
     * it sets the initial loading state to true, anticipating an initial fetch.
     */
    () => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem(STORAGE_KEY);
  });

  const [error, setError] = useState<string | null>(null);

  /**
   * Persists users to local storage on changes.
   *
   * This effect runs whenever the users array changes, calling persistUsers
   * to ensure local storage always reflects the latest state.
   */
  useEffect(() => {
    persistUsers(users);
  }, [users]);

  /**
   * Fetches initial users from the API if not already cached.
   *
   * It checks local storage first. If valid users exist, it skips fetching.
   * Otherwise, it creates an AbortController and defines an async loadUsers function
   * to fetch data from the API, updating state on success or failure.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cachedUsers = window.localStorage.getItem(STORAGE_KEY);
    if (cachedUsers) {
      try {
        const parsedUsers = JSON.parse(cachedUsers) as User[];
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) return;
      } catch (e) {
        console.warn("Failed to parse cached users", e);
      }
    }

    const controller = new AbortController();

    /**
     * Executes the API request to load users.
     *
     * Sets loading to true, clears errors, and makes a fetch request. If successful,
     * updates the users state. If an error occurs, updates the error state.
     */
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_BASE_URL, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load users.");
        const data: User[] = await response.json();
        setUsers(data);
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") return;
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load users.");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
    /**
     * Cleanup function to abort the fetch request.
     * 
     * Invokes the abort method on the AbortController if the component unmounts.
     */
    return () => controller.abort();
  }, []);

  /**
   * Refreshes the user list from the API or local storage.
   *
   * Sets loading to true and attempts to fetch from the API. On success, it merges
   * logic with local storage (favoring existing stored users if present) and updates
   * both state and local storage.
   */
  const refreshUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Unable to refresh users.");
      const data: User[] = await response.json();
      const existingUsers = readStoredUsers();
      const nextUsers = existingUsers.length > 0 ? existingUsers : data;
      setUsers(nextUsers);
      persistUsers(nextUsers);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to refresh users.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adds a new user to the state.
   *
   * Receives a user object and prepends it to the current list of users.
   */
  const addUser = useCallback((user: User) => {
    setUsers(
      /**
       * Updates the users array by prepending the new user.
       * 
       * Returns a new array with the provided user as the first element.
       */
      (current) => [user, ...current]
    );
  }, []);

  /**
   * Updates an existing user in the state.
   *
   * Iterates through the current users array, finding the user with the matching ID,
   * and merges the provided updates into that user object while leaving others intact.
   */
  const updateUser = useCallback((id: number, updates: UserFormData | User) => {
    setUsers(
      /**
       * Maps over the current users array to apply updates.
       * 
       * Returns a new array where the user matching the given ID is updated.
       */
      (current) =>
        current.map(
          /**
           * Checks and updates a specific user object.
           * 
           * If the user ID matches, returns a new merged user object; otherwise returns the user unchanged.
           */
          (user) =>
            user.id === id ? { ...user, ...updates, id } : user
        )
    );
  }, []);

  /**
   * Removes a user from the state.
   *
   * Filters the current array of users, keeping only those whose ID does not match
   * the provided ID.
   */
  const deleteUser = useCallback((id: number) => {
    setUsers(
      /**
       * Filters the current users array.
       * 
       * Returns a new array excluding the user with the specified ID.
       */
      (current) => current.filter(
        /**
         * Checks if the user should be kept.
         * 
         * Returns true if the user's ID does not match the ID to delete.
         */
        (user) => user.id !== id
      )
    );
  }, []);

  /**
   * Retrieves a specific user by their ID.
   *
   * Normalizes the provided ID to a number and searches the users array
   * for a matching user object.
   */
  const getUserById = useCallback((id: number | string) => {
    const normalizedId = Number(id);
    return users.find(
      /**
       * Checks if the user matches the normalized ID.
       * 
       * Returns true if the user's ID matches the requested ID.
       */
      (user) => user.id === normalizedId
    );
  }, [users]);

  /**
   * Memoizes the context value object.
   *
   * Bundles all state variables and action functions into a single object.
   */
  const value = useMemo(
    /**
     * Constructs the memoized value object.
     * 
     * Returns an object containing the current user state and manipulation methods.
     */
    () => ({
      users,
      loading,
      error,
      refreshUsers,
      addUser,
      updateUser,
      deleteUser,
      getUserById,
    }),
    [addUser, deleteUser, error, getUserById, loading, refreshUsers, updateUser, users]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
