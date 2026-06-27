/**
 * @file useUserContext.ts
 * @description Hook to access UserContext.
 *
 * @see {@link ../context/userContextStore.ts}
 * @see {@link ../context/UserContext.tsx}
 * @see {@link ../components/UserList.tsx}
 * @see {@link ../components/UserForm.tsx}
 * @see {@link ../components/UserDetail.tsx}
 * @see {@link ../components/Home.tsx}
 * @see {@link ../App.tsx}
 */

import { useContext } from "react";
import { UserContext } from "../context/userContextStore";

/**
 * Retrieves the UserContext value.
 *
 * It uses the useContext hook to access the current value of UserContext.
 * If the hook is called outside of a UserProvider (where context would be undefined),
 * it throws an error to enforce proper provider wrapping. Otherwise, it returns the context.
 */
export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used inside UserProvider");
  }

  return context;
}
