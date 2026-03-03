import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { SiteLangProvider } from "./content/useSiteLang";
import "./index.css";
import "./design-system.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SiteLangProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </SiteLangProvider>
  </React.StrictMode>,
);
