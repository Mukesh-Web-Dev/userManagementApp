# User Management System

A robust, offline-first, performance-optimized User Management System built with React 19, TypeScript, and Vite. This application interfaces with the JSONPlaceholder API to provide full CRUD (Create, Read, Update, Delete) capabilities.

Designed to serve as a production-grade template, this application demonstrates deep proficiency in React architecture, state management, edge-case mitigation, and performance tuning.

---

## 📑 Table of Contents

- [Features &amp; Benefits](#-features--benefits)
- [Application Architecture](#-application-architecture)
- [Technical Approach &amp; Methodologies](#-technical-approach--methodologies)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)

---

## 🌟 Features & Benefits

Why does this app stand out? Instead of just mapping over API results, this application implements rigorous safeguards typical of enterprise software.

* **Offline-First & Optimistic UI**: The app caches all API results into `localStorage`. When the API is unreachable, the app seamlessly falls back to cached data. Updates are optimistically rendered to the UI instantly for a snappy feel, syncing in the background.
* **Memory Leak Prevention**: Asynchronous network requests (`POST`, `PUT`, `DELETE`) are wrapped in `AbortControllers`. If a user initiates a request and immediately navigates away, the fetch aborts cleanly, preventing React "unmounted component" state-update warnings.
* **Dirty Form Protection**: Employs a `beforeunload` event listener that tracks form modifications. If a user accidentally attempts to close the tab or refresh with unsaved changes, the browser natively prompts them to prevent data loss.
* **Advanced Rendering Performance**: Implements strict referential equality. Derived state slicing (like dashboard previews) is wrapped in `useMemo`, and heavy list mappings are isolated into `React.memo` components so that modifying one list item doesn't re-render the entire grid.
* **Robust Type Safety & Validation**: Full TypeScript coverage. Forms are guarded against bad user input using Regex email/phone validators, and URL parameters are strictly checked against `NaN` injection.

---

## 🏗 Application Architecture

The application relies on the Context API paired with custom hooks for global state management, avoiding the overhead of heavy third-party libraries for a focused, lightweight footprint.

### Data Flow Pattern

1. **Context Store Definitions** (`userContextStore.ts`, `notificationContextStore.ts`): Defines the shape and types of the Contexts independently of React to prevent circular dependencies.
2. **Context Providers** (`UserContext.tsx`, `NotificationContext.tsx`): Implement the business logic. `UserContext` hydrates initial state from `localStorage`, handles API negotiations, and provides methods (`addUser`, `updateUser`, `deleteUser`).
3. **Custom Hooks** (`useUserContext.ts`, `useNotification.ts`): Consumer wrappers that throw errors if accessed outside their Provider boundaries, ensuring safe usage.
4. **UI Components**: React components consume the hooks. Components are strictly presentational or focus purely on local UI state (like modals and form fields), leaving business logic to the Contexts.

---

## 🚀 Technical Approach & Methodologies

Here are the core techniques utilized to construct and harden this app:

1. **Component Separation**: Extracted reusable UI elements like `ConfirmationModal` and `NotificationBanner` to keep main page components clean.
2. **JSDoc Documentation**: Every function, component, hook, and nested callback in the codebase features concise JSDoc comments explaining *what* it does and mechanically *how* it works, accompanied by `@see` tags for easy navigation.
3. **Strict Styling Constraints**: Utilizing vanilla CSS with a premium, responsive layout. Unused CSS tokens were actively purged to keep bundle sizes minimal.
4. **Defensive Programming**:
   * `try/catch/finally` blocks used extensively for API interactions.
   * `Array.isArray()` checks injected into `localStorage` parsing to prevent app crashes if browser memory is maliciously or accidentally corrupted (e.g. injected with `{}` instead of `[]`).

---

## 💻 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm

### Installation & Setup

1. **Clone / Download the repository**
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Run the Development Server**
   ```bash
   npm run dev
   ```

   *The app will be available at `http://localhost:5173`.*

### Building for Production

To create a highly optimized production build:

```bash
npm run build
```

This generates a `dist` folder. You can preview the production build locally by running:

```bash
npm run preview
```

### Linting & Type Checking

To verify codebase integrity (as expected in a CI/CD pipeline):

```bash
npx eslint . && npx tsc -b
```

---

## 🗂 Project Structure

```text
userManagementApp/
├── index.html                   # HTML Entry Point
├── package.json                 # Dependencies & Scripts
├── vite.config.ts               # Vite Configuration
├── eslint.config.js             # Linter Configuration
└── src/
    ├── main.tsx                 # React Application Entry
    ├── App.tsx                  # Root Routing & Layout 
    ├── types.ts                 # Shared Types & API Constants
    ├── index.css                # Global Tokens & Styling
    ├── App.css                  # Layout Styling
    │
    ├── context/
    │   ├── userContextStore.ts  
    │   ├── UserContext.tsx      # Handles API Sync & localStorage caching
    │   ├── notificationContextStore.ts
    │   └── NotificationContext.tsx 
    │
    ├── hooks/
    │   ├── useUserContext.ts    # Consumer Hook
    │   └── useNotification.ts   # Consumer Hook
    │
    └── components/
        ├── Home.tsx             # Dashboard View (Memoized slicing)
        ├── UserList.tsx         # User Grid View (Memoized cards)
        ├── UserForm.tsx         # Create/Edit Form (Dirty checking & Regex)
        ├── UserDetail.tsx       # Read-only Profile
        ├── ConfirmationModal.tsx# Reusable Delete Modal
        ├── NotificationBanner.tsx# Global Toast Messages
        ├── SkeletonLoader.tsx   # Loading State UI
        └── NotFound.tsx         # 404 Fallback Route
```
