/**
 * @file userContextStore.ts
 * @description UserContext and types.
 *
 * @see {@link ./UserContext.tsx}
 * @see {@link ../hooks/useUserContext.ts}
 * @see {@link ../types.ts}
 * @see {@link ../App.tsx}
 */

import { createContext } from "react";
import type { User, UserFormData } from "../types";

export type UserContextValue = {
  users: User[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (id: number, updates: UserFormData | User) => void;
  deleteUser: (id: number) => void;
  getUserById: (id: number | string) => User | undefined;
};

export const UserContext = createContext<UserContextValue | null>(null);
