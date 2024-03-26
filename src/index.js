import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import './i18n';
import { I18nextProvider } from 'react-i18next';
import { RecoveryContextProvider } from "./context/recoveryContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <I18nextProvider>
      <DarkModeContextProvider>
        <AuthContextProvider>
          <RecoveryContextProvider>
            <App />
          </RecoveryContextProvider>
        </AuthContextProvider>
      </DarkModeContextProvider>
    </I18nextProvider>
  </React.StrictMode>
);
