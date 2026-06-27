/**
 * @file types.ts
 * @description Shared TypeScript types and constants.
 *
 * @see {@link ./context/userContextStore.ts}
 * @see {@link ./context/UserContext.tsx}
 * @see {@link ./components/UserForm.tsx}
 * @see {@link ./components/UserList.tsx}
 * @see {@link ./components/UserDetail.tsx}
 * @see {@link ./components/Home.tsx}
 */

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export type UserFormData = Omit<User, "id">;

export const API_BASE_URL = "https://jsonplaceholder.typicode.com/users";
