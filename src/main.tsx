/**
 * @file main.tsx
 * @description Application entry point.
 *
 * @see {@link ./index.css}
 * @see {@link ./App.tsx}
 * @see {@link ../index.html}
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
