import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Apply persisted theme before first paint
try {
  const saved = localStorage.getItem("securevote-theme");
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed?.state?.theme === "dark") document.documentElement.classList.add("dark");
  }
} catch {
  void 0;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
