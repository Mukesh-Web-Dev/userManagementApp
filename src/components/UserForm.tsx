/**
 * @file UserForm.tsx — Create / Edit User Form
 *
 * A dual-purpose form component that handles both creating and editing users.
 * Uses optimistic UI updates before network requests resolve.
 *
 * @see {@link ../types.ts}
 * @see {@link ../hooks/useUserContext.ts}
 * @see {@link ../hooks/useNotification.ts}
 * @see {@link ../context/UserContext.tsx}
 * @see {@link ./UserList.tsx}
 * @see {@link ./UserDetail.tsx}
 * @see {@link ../App.tsx}
 *
 * @module components/UserForm
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { User, UserFormData } from "../types";
import { API_BASE_URL } from "../types";
import { useNotification } from "../hooks/useNotification";
import { useUserContext } from "../hooks/useUserContext";

/**
 * Renders a form for creating a new user or editing an existing one.
 * It determines the mode based on the URL parameter 'id', initializes form state,
 * handles API interactions, and updates the UserContext accordingly.
 */
export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { notify } = useNotification();
  const { addUser, updateUser, getUserById } = useUserContext();

  const initialUser = isEditing && id ? getUserById(id) : null;

  /**
   * Initializes the form data state.
   * It pre-fills the form with existing user data if editing and the user is found in context,
   * otherwise it initializes with empty fields for a new user.
   */
  const [formData, setFormData] = useState<UserFormData>(() => {
    if (initialUser) {
      return {
        name: initialUser.name,
        email: initialUser.email,
        phone: initialUser.phone,
      };
    }
    return { name: "", email: "", phone: "" };
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Tracks if the form has unsaved modifications.
   */
  const isDirty = useMemo(() => {
    if (isEditing && initialUser) {
      return (
        formData.name !== initialUser.name ||
        formData.email !== initialUser.email ||
        formData.phone !== initialUser.phone
      );
    }
    return formData.name !== "" || formData.email !== "" || formData.phone !== "";
  }, [formData, initialUser, isEditing]);

  /**
   * Warns the user if they attempt to close the tab with unsaved changes.
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  const submitAbortControllerRef = useRef<AbortController | null>(null);

  /**
   * Aborts any pending submit requests if the component unmounts.
   */
  useEffect(() => {
    return () => submitAbortControllerRef.current?.abort();
  }, []);

  /**
   * Effect hook to fetch user details if editing and the user is not in the local context.
   * It sets up an AbortController to cancel the fetch if the component unmounts
   * or the dependencies change, and updates the form data once fetched.
   */
  useEffect(() => {
    if (!isEditing || !id) return;

    const controller = new AbortController();
    const existingUser = getUserById(id);

    if (existingUser) return;

    /**
     * Fetches the user data from the API.
     * It retrieves the specific user by ID, updates the form data state with the response,
     * and handles any loading or error states during the network request.
     */
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("User not found.");
        const data: User = await response.json();

        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") return;
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load user data.");
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
    return () => controller.abort();
  }, [getUserById, id, isEditing]);

  /**
   * Handles the form submission for creating or updating a user.
   * It prevents the default form action, validates the input fields, constructs the user object,
   * updates the context locally (optimistic update), and sends the corresponding API request.
   *
   * @param event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    if (!trimmedData.name || !trimmedData.email || !trimmedData.phone) {
      setError("All fields are required and must contain valid text.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^[\d\s\-()+.]+$/;
    if (!phoneRegex.test(trimmedData.phone) || trimmedData.phone.length < 5) {
      setError("Please enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);

    const parsedId = isEditing && id ? parseInt(id, 10) : Date.now();
    const safeId = isNaN(parsedId) ? Date.now() : parsedId;

    const normalizedUser: User = {
      id: safeId,
      name: trimmedData.name,
      email: trimmedData.email,
      phone: trimmedData.phone,
    };

    if (isEditing && !isNaN(parsedId)) {
      updateUser(safeId, normalizedUser);
    } else {
      addUser(normalizedUser);
    }

    const url = isEditing ? `${API_BASE_URL}/${id}` : API_BASE_URL;
    const method = isEditing ? "PUT" : "POST";

    submitAbortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmedData as UserFormData),
        signal: submitAbortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Unable to sync the user with the API.");

      notify(`User ${isEditing ? "updated" : "created"} successfully.`, "success");
      navigate("/users");
    } catch (submitError) {
      if (submitError instanceof Error && submitError.name === "AbortError") return;
      
      const message = submitError instanceof Error ? submitError.message : "Submission failed.";
      setError(message);
      notify(`${message} The change was still saved in your local list.`, "error");
      navigate("/users");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles input changes to update the form data state.
   * It reads the name and value from the event target and merges them into the current state.
   *
   * @param event - The input change event.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  if (loading) return <div className="spinner">Loading user data...</div>;

  return (
    <div className="form-container">
      <div className="form-top-actions">
        <h2>{isEditing ? "Edit User" : "Create New User"}</h2>
        <div className="inline-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/users")}
          >
            Close
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form className="user-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
}
