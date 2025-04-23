import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import '@fontsource-variable/dm-sans';
import {Toaster} from "sonner"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
);
